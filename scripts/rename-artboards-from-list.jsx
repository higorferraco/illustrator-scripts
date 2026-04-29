/*
 * Nome do script: Renomear artboards a partir de uma lista
 * O que ele faz: Permite colar uma lista de nomes e aplica cada linha a um artboard, seguindo a ordem do documento.
 * Como usar: Abra um arquivo no Illustrator, execute o script, cole um nome por linha e clique em "Renomear".
 * Autor: Higor Ferraço
 */

#target illustrator

(function () {
    if (app.documents.length === 0) {
        alert("Abra um documento no Illustrator antes de executar este script.");
        return;
    }

    var doc = app.activeDocument;
    var artboardCount = doc.artboards.length;

    function normalizeLines(text) {
        var rawLines = text.split(/\r\n|\r|\n/);
        var names = [];
        var i;

        for (i = 0; i < rawLines.length; i++) {
            var name = rawLines[i].replace(/^\s+|\s+$/g, "");

            if (name !== "") {
                names.push(name);
            }
        }

        return names;
    }

    function buildResultMessage(renamedCount, providedCount, totalArtboards) {
        var message = renamedCount + " artboards foram renomeados.";

        if (providedCount > totalArtboards) {
            message += "\n" + (providedCount - totalArtboards) + " nomes extras foram ignorados.";
        }

        if (providedCount < totalArtboards) {
            message += "\n" + (totalArtboards - providedCount) + " artboards permaneceram com o nome anterior.";
        }

        return message;
    }

    var dialog = new Window("dialog", "Renomear Artboards a Partir de Lista");
    dialog.orientation = "column";
    dialog.alignChildren = ["fill", "top"];
    dialog.spacing = 10;
    dialog.margins = 16;

    dialog.add("statictext", undefined, "Cole um nome por linha, seguindo a ordem dos artboards do documento.");
    dialog.add("statictext", undefined, "Artboards encontrados: " + artboardCount);

    var input = dialog.add("edittext", undefined, "", {
        multiline: true,
        scrolling: true
    });
    input.preferredSize = [520, 320];
    input.active = true;

    var buttonGroup = dialog.add("group");
    buttonGroup.alignment = "right";

    buttonGroup.add("button", undefined, "Cancelar", { name: "cancel" });
    var renameButton = buttonGroup.add("button", undefined, "Renomear", { name: "ok" });

    renameButton.onClick = function () {
        var names = normalizeLines(input.text);
        var totalToRename;
        var i;

        if (names.length === 0) {
            alert("Cole pelo menos um nome antes de continuar.");
            return;
        }

        totalToRename = Math.min(names.length, artboardCount);

        for (i = 0; i < totalToRename; i++) {
            doc.artboards[i].name = names[i];
        }

        alert(buildResultMessage(totalToRename, names.length, artboardCount));
        dialog.close();
    };

    dialog.show();
}());
