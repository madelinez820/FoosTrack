
import cv2
import math
import numpy as np
# from matplotlib import pyplot as plt
# import scipy.stats as st


def drawSquare(frame, pointTopLeft, squareSize, color=(255, 0, 0)):
    """
    @param frame - np.ndarray(np.uint8)

    @returns modified frame - np.ndarray(np.uint8)
    """
    modified_frame = frame.copy()
    y, x = pointTopLeft
#     print(x, y)
    cv2.rectangle(modified_frame, (x, y), (x + squareSize, y + squareSize), color, 5)
    return modified_frame    

def gkern(kernlen=60, nsig=0.5):
    """Returns a 2D Gaussian kernel."""

    x = np.linspace(-nsig, nsig, kernlen+1)
    kern1d = np.diff(st.norm.cdf(x))
    kern2d = np.outer(kern1d, kern1d)
    return kern2d/kern2d.sum()

def spiral(side):
    x = y = 0
    dx = 0
    dy = -1
    for i in range(side ** 2):
        if (-side / 2 < x <= side / 2):
            yield (x, y)
        if x == y or (x < 0 and x == -y) or (x > 0 and x == 1 - y):
            dx, dy = -dy, dx
        x, y = x + dx, y + dy
        
def downsample(frame, k):
    obj = (slice(None, None, k))
    return frame[obj, obj]


def getBallPositionApprox(frame, lastBallPosition, certainty, BALLSIZE, RODSIZE):
    generatorPosition = spiral(2 * RODSIZE)
    x, y = lastBallPosition
    mx = max(0, x - RODSIZE)
    my = max(0, y - RODSIZE)
    subframe = frame[mx : x + RODSIZE, my : y + RODSIZE, : ].astype(int)
    pnkCf = magicFormula(subframe, 4)
    centerPoint = np.unravel_index(pnkCf.argmin(), pnkCf.shape)
    a, b = centerPoint
    a = max(0, a - BALLSIZE // 2) + x - RODSIZE
    b = max(0, b - BALLSIZE // 2) + y - RODSIZE
    topLeftPoint = (a, b)
    return topLeftPoint, pnkCf[a, b]
#     maxSoFar = certainty
#     ballPosition = lastBallPosition
#     while True:
#         try:
#             positionToCheck = next(generatorPosition)
#         except StopIteration:
#             # return the highest one
#             break  # Iterator exhausted: stop the loop

def getBallPosition(frame, BALLSIZE):
    """
    Return top left point of a NxN square with the most probable position of the ball
    """
    frameInt = frame.astype(int)
    confidence = magicFormula(frameInt, BALLSIZE)
    centerPoint = np.unravel_index(confidence.argmin(), confidence.shape)
    x, y = centerPoint
    x = max(0, x - BALLSIZE // 2)
    y = max(0, y - BALLSIZE // 2)
    topLeftPoint = (x, y)
    return topLeftPoint, confidence[x, y]



def markFrame(frame, BALLSIZE, lastBallPosition):
    downsampledFrame = downsample(frame, 4)
    ballPosition, certainty = getBallPosition(downsampledFrame, BALLSIZE // 4)
    ballPosition = tuple([x * 4 for x in ballPosition])
#             print(ballPosition)
    if ballPosition == (0, 0):
        ballPosition = lastBallPosition
    else:
        lastBallPosition = ballPosition
    return drawSquare(frame, ballPosition, BALLSIZE), ballPosition

def markVideo(filename, BALLSIZE, RODSIZE):
    vidcap = cv2.VideoCapture(filename)
    success = True
    lastBallPosition = (0, 0)
    certainty = 0
    markedVideo = []
    while len(markedVideo) < 151:
        # if len(markedVideo) % 100 == 0:
            #print(f"Frame {len(markedVideo)}")
        success, frame = vidcap.read()

        if not success:
            break
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        downsampledFrame = downsample(frame, 4)
        if certainty < 0:
            ballPosition, certainty = getBallPositionApprox(frame, lastBallPosition, certainty, BALLSIZE, RODSIZE)
            markedVideo.append(drawSquare(frame, ballPosition, BALLSIZE, color=(0, 255, 0)))
        else:
            ballPosition, certainty = getBallPosition(downsampledFrame, BALLSIZE // 4)
            ballPosition = tuple([x * 4 for x in ballPosition])
#             print(ballPosition)
            if ballPosition == (0, 0):
                ballPosition = lastBallPosition
            else:
                lastBallPosition = ballPosition

            markedVideo.append(drawSquare(frame, ballPosition, BALLSIZE))
        
    return markedVideo

def magicFormula(frameInt, kernel_size = 60):
    pinkness = abs(190 - frameInt[ : , : , 0]) \
                + abs(100 - frameInt[ : , : , 1]) \
                + abs(100 - frameInt[ : , : , 2])
    shadowPinkiness = abs(160 - frameInt[ : , : , 0]) \
                + abs(90 - frameInt[ : , : , 1]) \
                + abs(90 - frameInt[ : , : , 2])
    
#     yellowness = abs(230 - frameInt[ : , : , 0]) \
#                 + abs(140 - frameInt[ : , : , 1]) \
#                 + abs(25 - frameInt[ : , : , 2])
    
    kernel = np.ones((kernel_size, kernel_size))
    pinknessConfidence = cv2.filter2D(pinkness.astype(np.float32), 1, kernel)
    return pinknessConfidence
                
