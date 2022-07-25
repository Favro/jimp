#!/bin/bash

for dir in cli core custom jimp plugin-blit plugin-blur plugin-circle plugin-color plugin-contain plugin-cover plugin-crop plugin-displace plugin-dither plugin-fisheye plugin-flip plugin-gaussian plugin-invert plugin-mask plugin-normalize plugin-print plugin-resize plugin-rotate plugin-scale plugin-shadow plugin-threshold plugins test-utils type-bmp type-gif type-jpeg type-png type-tiff types utils; do
	pushd $dir
	npm install
	popd
done
