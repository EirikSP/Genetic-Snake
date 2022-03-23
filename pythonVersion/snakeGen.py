from ast import For
from re import A
from time import sleep
from matplotlib.font_manager import json_dump
import numpy as np
from graphics import *

#win = GraphWin("My Circle", 1000, 1000,  autoflush=False)


def spawnFruit(snake, m):
    fruit = [np.random.randint(0,m), np.random.randint(0,m)]
    while (fruit in snake):
        fruit = [np.random.randint(0,m), np.random.randint(0,m)]
    return fruit


def updateBoard(board, miscFields,snake, fruit):
    for part in snake:
        board[part[0], part[1], 0] = 1
    board[fruit[0], fruit[1], 1] = 1
    miscFields = np.array([snake[0][0], snake[0][1], len(snake), 1])


def drawBoard(snake, fruit):
    win.clear()
    squareList = []
    for part in snake:
        squareList.append(Rectangle(Point(part[0]*1000/m, part[1]*1000/m), Point((part[0]+1)*1000/m, (part[1]+1)*1000/m)))

    Fruit = Rectangle(Point(fruit[0]*1000/m, fruit[1]*1000/m), Point((fruit[0]+1)*1000/m, (fruit[1]+1)*1000/m))
    Fruit.setFill("green")
    Fruit.draw(win)

    for obj in squareList:
        obj.setFill("black")
        obj.draw(win)



def moveSnake(direction, snake, fruit, m):
    if direction == "Up":
        snake.insert(0, [snake[0][0], snake[0][1] - 1])
    elif direction == "Right":
        snake.insert(0, [snake[0][0] + 1, snake[0][1]])
    elif direction == "Down":
        snake.insert(0, [snake[0][0], snake[0][1] + 1])
    elif direction == "Left":
        snake.insert(0, [snake[0][0] - 1, snake[0][1]])
    
    if (snake[0][0] != fruit[0] or snake[0][1] != fruit[1]):
        snake.pop()
    else:
        fruit = spawnFruit(snake, m)


def initializeBoard(m, snake, fruit):
    board = np.zeros((m,m,2))
    miscFields = np.array([snake[0][0], snake[0][1], len(snake), 1])
    updateBoard(board,miscFields ,snake, fruit)

    return board, miscFields



def generateSolution(m, miscFieldLen):
    boardParams = (np.random.rand(4, m, m, 2) - 0.5)*50
    miscParams = (np.random.rand(4, miscFieldLen) - 0.5)*50

    return [boardParams, miscParams]



def predictMove(board, miscFields, solution):
    predictDict = {0:"Up", 1:"Right", 2:"Down", 3:"Left"}
    predictionArray = []
    for i in range(4):
        predictionArray.append(np.sum(board*solution[0][i]) + np.sum(miscFields*solution[1][i]))
    maxIndex = 0
    maxValue = predictionArray[0]
    for i in range(len(predictionArray)):
        if predictionArray[i] > maxValue:
            maxIndex = i
            maxValue = predictionArray[i]
    return predictDict[maxIndex]


def gameSimulation(solution):
    snake = [[4,2],[3,2],[3,3]]
    fruit = spawnFruit(snake, m)
    alive = True
    i=0 
    board, miscFields = initializeBoard(m, snake, fruit)
    while(alive and i<300):
        
        updateBoard(board, miscFields, snake, fruit)
        moveSnake(predictMove(board, miscFields, solution), snake, fruit, m)
        for elem in snake:
            if snake.count(elem) > 1:
                alive = False

        if (snake[0][0]>=m or snake[0][0]<0) or (snake[0][1]>=m or snake[0][1]<0):
            alive = False
        i += 1
    return (len(snake)-3)


def saveSolution(solution):
    pass

def generatePopulation(populationNumber):
    solutionPopulation = []
    i = 0
    while i<populationNumber:
        solutionPopulation.append(generateSolution(m, 4))
        i+=1
    return solutionPopulation

def mutateSolution(solution):
    return solution


def solutionCrossOver(solution1, solution2):
    return solution1


def sortList(element):
    return element[1]



def passGeneration(solutionPopulation):
    rankedSolutions = []
    for solutionNum in range(len(solutionPopulation)):
        solutionFitness = (gameSimulation(solutionPopulation[solutionNum]) + gameSimulation(solutionPopulation[solutionNum]) + gameSimulation(solutionPopulation[solutionNum]) + gameSimulation(solutionPopulation[solutionNum]) + gameSimulation(solutionPopulation[solutionNum]))/5
        rankedSolutions.append([solutionNum, solutionFitness])
    rankedSolutions.sort(key=sortList, reverse=True)
    totalFitness = np.sum(np.array(rankedSolutions), axis=0)[1]
    parentGroup = []
    nextGeneration = []
    
    

    
    for i in range(len(rankedSolutions)):
        rankedSolutions[i][1] = 9*rankedSolutions[i][1]/totalFitness
        if np.random.random() < rankedSolutions[i][1]:
            parentGroup.append(solutionPopulation[rankedSolutions[i][0]])
    
    i=0
    while len(nextGeneration)<101:
        nextGeneration.append(parentGroup[i])
        for parent2 in parentGroup:
            child =  solutionCrossOver(mutateSolution(parentGroup[i]), parent2)
            nextGeneration.append(child)
        if(i == len(parentGroup) - 1):
            i=0
        
    return nextGeneration


        



m = 10 #Dimension of board.
populationNumber = 100


print(len(passGeneration(generatePopulation(populationNumber))))


#while(True):
    #moveSnake(win.getKey(), testSnake)
    #updateBoard(board, testSnake, testFruit)
    #drawBoard(testSnake, testFruit)




