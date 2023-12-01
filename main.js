"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var main = function () {
    // Image
    var image_width = 256;
    var image_height = 256;
    //Render
    var ppmContent = "P3\n".concat(image_width, " ").concat(image_height, "\n255\n");
    for (var i = 0; i < image_height; i++) {
        for (var j = 0; j < image_width; j++) {
            var r = j / (image_width - 1);
            var g = i / (image_height - 1);
            var b = 0;
            var ir = 255.999 * r;
            var ig = 255.999 * g;
            var ib = 255.999 * b;
            ppmContent += "".concat(ir, " ").concat(ig, " ").concat(ib, "\n");
        }
    }
    // Save PPM content to a file
    fs.writeFileSync('output.ppm', ppmContent, 'utf8');
};
main();
