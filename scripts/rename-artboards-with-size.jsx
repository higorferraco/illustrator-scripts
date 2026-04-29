/*
 * Nome do script: Renomear artboards com tamanho
 * O que ele faz: Adiciona automaticamente as dimensões de cada artboard ao final do nome, facilitando a exportação.
 * Como usar: Abra um arquivo no Illustrator e execute o script para atualizar todos os nomes dos artboards.
 * Autor: Higor Ferraço
 */

#target illustrator

(function () {
    if (app.documents.length === 0) {
        alert("Abra um documento no Illustrator antes de executar este script.");
        return;
    }

    var doc = app.activeDocument;

    function getUnitInfo(rulerUnit) {
        if (rulerUnit === RulerUnits.Pixels) {
            return { label: "px", unitValue: null };
        }

        if (rulerUnit === RulerUnits.Centimeters) {
            return { label: "cm", unitValue: "cm" };
        }

        if (rulerUnit === RulerUnits.Millimeters) {
            return { label: "mm", unitValue: "mm" };
        }

        if (rulerUnit === RulerUnits.Inches) {
            return { label: "in", unitValue: "in" };
        }

        if (rulerUnit === RulerUnits.Picas) {
            return { label: "pc", unitValue: "pc" };
        }

        return { label: "pt", unitValue: "pt" };
    }

    function convertPoints(valueInPoints, unitInfo) {
        if (unitInfo.label === "px") {
            return valueInPoints;
        }

        return new UnitValue(valueInPoints, "pt").as(unitInfo.unitValue);
    }

    function formatNumber(value) {
        var rounded = Math.round(value * 100) / 100;
        var text = rounded.toString();

        if (text.indexOf(".") !== -1) {
            text = text.replace(/0+$/g, "").replace(/\.$/g, "");
        }

        return text;
    }

    function removePreviousSizeSuffix(name) {
        return name.replace(/\s*\[[0-9.,]+\s*x\s*[0-9.,]+\s*(px|cm|mm|in|pt|pc)\]$/i, "");
    }

    var unitInfo = getUnitInfo(doc.rulerUnits);
    var scaleFactor = doc.scaleFactor ? doc.scaleFactor : 1;
    var artboards = doc.artboards;
    var i;

    for (i = 0; i < artboards.length; i++) {
        var artboard = artboards[i];
        var rect = artboard.artboardRect;
        var widthInPoints = (rect[2] - rect[0]) / scaleFactor;
        var heightInPoints = (rect[1] - rect[3]) / scaleFactor;
        var width = formatNumber(convertPoints(widthInPoints, unitInfo));
        var height = formatNumber(convertPoints(heightInPoints, unitInfo));
        var baseName = removePreviousSizeSuffix(artboard.name);

        artboard.name = baseName + " [" + width + "x" + height + unitInfo.label + "]";
    }

    alert(artboards.length + " artboards foram atualizados em " + unitInfo.label + ".");
}());
