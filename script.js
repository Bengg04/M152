// canvas is always a square
const CANVAS_SIZE = 300;

let input;
let output;

window.onload = () => {
    input = document.getElementById("input");
    output = document.getElementById("output");

    input.width = CANVAS_SIZE;
    input.height = CANVAS_SIZE;
    output.width = CANVAS_SIZE;
    output.height = CANVAS_SIZE;

    document.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    document.addEventListener("drop", e => {
        e.preventDefault();

        const reader = new FileReader();
        reader.readAsDataURL(e.dataTransfer.files[0]);
        reader.onload = () => {
            const image = new Image();
            image.src = reader.result;
            image.onload = () => {
                const context = input.getContext("2d");

                let x;
                let y;
                let width;
                let height;
                if(image.width > image.height) {
                    width = CANVAS_SIZE;
                    height = CANVAS_SIZE * image.height / image.width;
                    x = 0;
                    y = (CANVAS_SIZE - height) / 2;
                }else{
                    width = CANVAS_SIZE * image.width / image.height;
                    height = CANVAS_SIZE;
                    x = (CANVAS_SIZE - width) / 2;
                    y = 0
                }
                context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
                context.drawImage(image, x, y, width, height);
            }
        }
    })
}

function convert() {
    let inputContext = input.getContext("2d");
    let outputContext = output.getContext("2d");

    let imageData = inputContext.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    let pixels = imageData.data;

    // Custom sorting function based on pixel brightness (grayscale value)
    function sortFunction(a, b) {
        const brightnessA = (a[0] + a[1] + a[2]) / 3;
        const brightnessB = (b[0] + b[1] + b[2]) / 3;
        return brightnessA - brightnessB;
    }

    // Convert pixels to an array of RGBA values
    const pixelArray = [];
    for (let i = 0; i < pixels.length; i += 4) {
        pixelArray.push([
            pixels[i],
            pixels[i + 1],
            pixels[i + 2],
            pixels[i + 3]
        ]);
    }

    // Sort the pixelArray based on the custom sort function
    pixelArray.sort(sortFunction);

    // Update the image data with the sorted pixelArray
    for (let i = 0; i < pixelArray.length; i++) {
        const [r, g, b, a] = pixelArray[i];
        const dataIndex = i * 4;
        pixels[dataIndex] = r;
        pixels[dataIndex + 1] = g;
        pixels[dataIndex + 2] = b;
        pixels[dataIndex + 3] = a;
    }

    outputContext.putImageData(imageData, 0, 0);
}
