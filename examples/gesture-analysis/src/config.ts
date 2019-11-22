import { Vec2 } from "@thi.ng/vectors";

// initial call to action gesture
// (recorded handwriting)
// prettier-ignore
const raw = [
    204,  37,  204,  38,  204, 39, 204, 45, 204, 58, 204, 73, 204, 94, 204, 114,
    202, 137, 199, 162, 196, 186, 194, 208, 190, 242, 189, 257, 188, 279, 186, 296,
    186, 310, 185, 317, 185, 324, 185, 329, 184, 334, 184, 336, 183, 339, 182, 340,
    181, 340, 179, 340, 176, 340, 169, 336, 160, 329, 144, 315, 134, 303, 128, 296,
    121, 289, 117, 283, 113, 277, 111, 273, 108, 267, 107, 263, 105, 257, 104, 253,
    104, 249, 104, 246, 104, 240, 106, 235, 112, 227, 120, 218, 132, 205, 138, 199,
    146, 192, 153, 187, 160, 184, 166, 181, 173, 178, 181, 176, 189, 174, 195, 173,
    200, 173, 204, 173, 207, 172, 208, 172, 208, 172, 209, 171, 210, 171, 210, 171,
    211, 171, 211, 170, 211, 170, 211, 170, 212, 170, 212, 170, 215, 169, 218, 167,
    221, 166, 224, 164, 226, 162, 228, 160, 231, 156, 232, 154, 233, 152, 234, 150,
    234, 147, 235, 142, 236, 138, 237, 132, 237, 129, 238, 126, 238, 124, 238, 123,
    238, 123, 238, 123, 238, 123, 237, 123, 237, 124, 235, 126, 234, 129, 232, 132,
    231, 135, 230, 137, 230, 139, 229, 141, 228, 145, 228, 150, 226, 155, 225, 159,
    224, 165, 224, 167, 223, 170, 223, 172, 222, 174, 221, 179, 221, 182, 220, 187,
    220, 192, 220, 199, 220, 205, 220, 213, 220, 223, 221, 236, 221, 249, 221, 259,
    221, 268, 222, 275, 223, 282, 224, 286, 224, 290, 224, 295, 224, 299, 225, 303,
    225, 306, 225, 308, 225, 310, 225, 311, 225, 312, 225, 313, 225, 313, 225, 314,
    225, 314, 225, 312, 225, 311, 225, 306, 225, 302, 225, 299, 225, 296, 225, 292,
    225, 288, 225, 283, 225, 277, 224, 272, 224, 266, 224, 261, 224, 256, 224, 252,
    224, 250, 225, 248, 226, 244, 226, 241, 227, 238, 228, 232, 228, 229, 229, 226,
    230, 222, 231, 218, 232, 215, 233, 211, 234, 208, 235, 205, 236, 202, 237, 200,
    238, 198, 239, 196, 240, 194, 241, 192, 243, 190, 245, 186, 248, 183, 251, 179,
    255, 174, 259, 170, 264, 164, 267, 160, 272, 155, 275, 150, 279, 146, 282, 143,
    285, 141, 288, 139, 291, 138, 295, 138, 298, 138, 303, 138, 307, 138, 310, 138,
    313, 139, 315, 141, 317, 144, 318, 145, 319, 146, 319, 147, 320, 147, 320, 148,
    321, 148, 321, 149, 322, 149, 322, 149, 322, 149, 322, 149, 322, 150, 322, 150,
    322, 150, 322, 150, 323, 151, 323, 152, 324, 153, 324, 156, 325, 160, 325, 163,
    326, 166, 327, 170, 328, 175, 330, 181, 331, 185, 333, 193, 334, 199, 336, 206,
    338, 213, 340, 219, 341, 225, 344, 233, 346, 240, 347, 243, 349, 250, 349, 253,
    350, 258, 351, 262, 351, 267, 351, 271, 351, 276, 351, 280, 351, 283, 351, 286,
    351, 288, 351, 290, 351, 292, 351, 293, 351, 293, 351, 294, 351, 295, 351, 295,
    350, 296, 347, 297, 343, 298, 338, 299, 332, 300, 326, 300, 320, 301, 316, 302,
    311, 302, 309, 303, 306, 303, 303, 303, 298, 303, 294, 303, 290, 302, 287, 301,
    285, 300, 283, 298, 282, 298, 280, 297, 279, 297, 277, 296, 276, 295, 275, 294,
    274, 293, 273, 292, 271, 291, 267, 288, 263, 285, 260, 283, 257, 280, 256, 278,
    255, 277, 254, 275, 254, 273, 254, 270, 254, 268, 254, 266, 254, 263, 256, 261,
    258, 258, 259, 256, 261, 254, 263, 252, 266, 249, 270, 246, 273, 244, 276, 241,
    280, 239, 284, 236, 287, 234, 294, 230, 298, 228, 303, 225, 307, 224, 311, 222,
    315, 221, 320, 219, 324, 218, 326, 216, 328, 215, 329, 214, 331, 212, 333, 210,
    336, 208, 339, 206, 340, 205, 341, 205, 342, 204, 342, 204, 342, 204, 342, 204,
    343, 204, 343, 205, 343, 205, 343, 205, 343, 205, 343, 206, 343, 206, 343, 206,
    343, 206, 343, 207, 343, 207, 343, 207, 343, 208, 343, 208, 344, 208, 344, 208,
    344, 208, 345, 207, 345, 207, 346, 206, 348, 204, 350, 202, 352, 199, 354, 195,
    357, 190, 358, 186, 359, 181, 360, 174, 360, 168, 360, 164, 360, 156, 360, 151,
    360, 147, 360, 143, 360, 138, 361, 134, 361, 130, 362, 127, 363, 125, 363, 123,
    363, 122, 364, 121, 364, 120, 365, 119, 366, 117, 366, 116, 366, 116, 366, 117,
    366, 120, 365, 125, 364, 132, 364, 142, 364, 152, 364, 163, 364, 174, 364, 186,
    365, 197, 366, 209, 367, 220, 370, 231, 377, 248, 380, 255, 387, 270, 390, 276,
    394, 283, 397, 288, 400, 292, 404, 295, 407, 297, 410, 299, 412, 300, 413, 301,
    415, 301, 415, 301, 416, 301, 416, 301, 416, 298, 416, 294, 416, 287, 414, 275,
    412, 266, 411, 260, 410, 254, 408, 249, 408, 245, 407, 241, 406, 238, 406, 233,
    406, 230, 406, 227, 406, 225, 405, 223, 405, 222, 405, 221, 406, 221, 410, 226,
    418, 233, 426, 239, 435, 247, 446, 255, 458, 263, 471, 270, 482, 277, 491, 281,
    496, 283, 501, 285, 505, 287, 508, 288, 511, 289, 513, 290, 514, 290, 515, 290,
    515, 284, 507, 261, 497, 238, 492, 222, 486, 203, 481, 191, 476, 182, 471, 175,
    464, 170, 457, 165, 449, 162, 445, 160, 439, 159, 435, 158, 433, 157, 431, 157,
    430, 156, 430, 155, 430, 154
];

// downscale & transform into memory mapped Vec2 array
export const CTA = Vec2.mapBuffer(raw, raw.length / 2);
