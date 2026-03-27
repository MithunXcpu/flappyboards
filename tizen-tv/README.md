# FlappyBoards - Samsung Tizen TV App

## Prerequisites
1. Install [Tizen Studio](https://developer.tizen.org/development/tizen-studio/download)
2. Install TV Extensions via Package Manager
3. Generate a Samsung certificate (Tools > Certificate Manager)

## Build & Deploy
1. Open Tizen Studio
2. Import this folder as a Web Application project
3. Connect your Samsung TV (must be in Developer Mode)
4. Right-click project > Run As > Tizen Web Application

## TV Developer Mode Setup
1. On your Samsung TV: Settings > General > System Manager
2. Enable Developer Mode
3. Enter your PC's IP address
4. Restart the TV
5. In Tizen Studio: Tools > Device Manager > Scan for devices

## Package for Distribution
1. Right-click project > Build Signed Package
2. This creates a .wgt file you can install on any Samsung TV
