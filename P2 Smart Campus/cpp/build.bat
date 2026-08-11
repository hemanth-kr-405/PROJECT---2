@echo off
REM ============================================================
REM Smart Campus Navigation - WASM Build Script (Windows)
REM Requires Emscripten SDK: https://emscripten.org/
REM ============================================================

echo Building C++ pathfinder to WebAssembly...

em++ pathfinder.cpp -o ../public/pathfinder.js ^
    -s WASM=1 ^
    -s EXPORTED_FUNCTIONS="[""_findPath"",""_initGraph"",""_addNode"",""_addEdge"",""_getTotalDistance"",""_malloc"",""_free""]" ^
    -s EXPORTED_RUNTIME_METHODS="[""ccall"",""cwrap"",""UTF8ToString""]" ^
    -s MODULARIZE=1 ^
    -s EXPORT_NAME="PathfinderModule" ^
    -s ALLOW_MEMORY_GROWTH=1 ^
    -O2

echo Done! Output: public/pathfinder.js + public/pathfinder.wasm

REM Standalone test build (native)
REM g++ -std=c++17 -O2 pathfinder.cpp -o pathfinder_test
REM pathfinder_test.exe
