window.onload = () => {
    const animateAngleCheckBox = document.getElementById("animateAngle");
    const animateRadiusCheckBox = document.getElementById("animateRadius");
    const radiusSlider = document.getElementById("radiusSlider");
    const vertexesSlider = document.getElementById("vertexesSlider");

    const canvas = document.getElementById("canvas");
    const width = canvas.width;
    const height = canvas.height;
    const context = canvas.getContext("2d");

    let animateRadius = animateRadiusCheckBox.checked;
    let animateAngle = animateAngleCheckBox.checked;

    let vertexes = vertexesSlider.value;
    let initialRadius = radiusSlider.value;
    let angleOffset = 0;
    let numberOfCircles = 5;

    const CENTER = {x: width / 2, y: height / 2};

    animateAngleCheckBox.onclick = () => {
        animateAngle = animateAngleCheckBox.checked;
    };

    animateRadiusCheckBox.onclick = () => {
        animateRadius = animateRadiusCheckBox.checked;
        if(!animateRadius) radiusSlider.disabled = false;
        else radiusSlider.disabled = true;
    };

    radiusSlider.onchange = () => {
        initialRadius = radiusSlider.value;
    };

    vertexesSlider.onchange = () => {
        vertexes = vertexesSlider.value;
    };

    const drawSquare = (diagonal, centerX, centerY, angle) => {
        let alpha = angle;
        context.beginPath();
        let x, y;
        for(let i = 0; i < 4; i++){
            x = centerX + diagonal/2 * Math.sin(alpha);
            y = centerY + diagonal/2 * Math.cos(alpha);
            if(i == 0) context.moveTo(x, y);
            else context.lineTo(x, y);
            alpha += Math.PI / 2;
        }
        const distance = Math.sqrt( (centerX - CENTER.x)**2 + (centerY - CENTER.y)**2 );
        context.closePath();
        context.fillStyle = getColorFromDistance(distance);
        context.fill();
    }

    const draw = () => {
        context.clearRect(0, 0, width, height);
        let radius = initialRadius;
        if(animateRadius){
            radius = Math.abs(Math.sin(Date.now() / 1000)) * 50 + 70;
        }
        if(animateAngle) {
            angleOffset = Math.cos(Date.now() / 1000);
        }

        for(let j = 0; j < numberOfCircles; j++){
            const angleIncrement = Math.PI * 2 / vertexes;
            let angle = j % 2 == 0 ? angleOffset : angleOffset + angleIncrement / 2;
            for(let i = 0; i < vertexes; i++){
                angle += angleIncrement;
                const centerX = CENTER.x + radius * Math.cos(angle);
                const centerY = CENTER.y + radius * Math.sin(angle);
                
                drawSquare(Math.PI * 2 * radius / vertexes, centerX, centerY, -angle);
            }
            radius = radius * vertexes / (vertexes - Math.PI);
        }
        
        requestAnimationFrame(draw);
    };

    draw();
}

function getColorFromDistance(distance){
    const mapped = 512 / Math.PI * Math.atan(distance/100);
    return "rgb("+mapped+","+mapped+",255)";
}