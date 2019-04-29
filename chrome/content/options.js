var FPVSOptions = {
    mapping: [
        ["FolderPaneSwitcher-arrows-checkbox", "arrows", "bool"],
        ["FolderPaneSwitcher-delay-textbox", "delay", "int"],
        // Currently disabled
        //["FolderPaneSwitcher-drop-delay-textbox", "dropDelay", "int"],
    ],

    menuChangeHandler: function(event) {
        var menu_checkbox = event.target;
        menu_id = menu_checkbox.getAttribute("id");
        arrows_id = menu_id.replace('menu', 'arrows');
        var arrows_checkbox = document.getElementById(arrows_id);
        arrows_checkbox.disabled = ! menu_checkbox.hasAttribute("checked");
    },

    onLoad: function() {
        fpvsUtils.init();
        mapping = FPVSOptions.mapping;
        var preferences = document.getElementById("fpvs-preferences");
        var rows = document.getElementById("grid-rows");
        var views = fpvsUtils.getViews();
        for (var viewNum in views) {
            var row = document.createElement("row");
            var prefName = "views." + viewNum + ".menu_enabled";
            var menu_checkbox = document.createElement("checkbox");
            var box_id = viewNum + "_menu_checkbox";
            menu_checkbox.setAttribute("id", box_id);
            mapping.push([box_id, prefName, "bool"]);
            if (views[viewNum]['name'] == "all")
                // All Folders view can't be completely disabled.
                menu_checkbox.disabled = true;
            prefName = "views." + viewNum + ".arrows_enabled";
            var arrows_checkbox = document.createElement("checkbox");
            box_id = viewNum + "_arrows_checkbox";
            arrows_checkbox.setAttribute("id", box_id);
            mapping.push([box_id, prefName, "bool"]);
            fpvsUtils.addEventListener(
                menu_checkbox, "command", FPVSOptions.menuChangeHandler, true);
            row.appendChild(menu_checkbox);
            row.appendChild(arrows_checkbox);
            var label = document.createElement("label");
            label.appendChild(document.createTextNode(
                fpvsUtils.getStringPref(
                    fpvsUtils.viewsBranch, viewNum + ".display_name")));
            row.appendChild(label);
            rows.appendChild(row);
            FPVSOptions.menuChangeHandler({'target': menu_checkbox});
        }
        FPVSOptions.loadPrefs();
    },

    loadPrefs: function() {
        mapping.forEach(function(mapping) {
            var elt_id = mapping[0];
            var elt = document.getElementById(elt_id);
            var pref = mapping[1];
            var pref_type = mapping[2];
            var pref_func;
            switch (pref_type) {
            case "int":
                elt.value = fpvsUtils.prefBranch.getIntPref(pref);
                break;
            case "bool":
                elt.checked = fpvsUtils.prefBranch.getBoolPref(pref);
                break;
            case "string":
                elt.value = fpvsUtils.prefBranch.getStringPref(pref);
                break;
            case "char":
                elt.value = fpvsUtils.prefBranch.getCharPref(pref);
                break;
            default:
                throw new Error("Unrecognized pref type: " + pref_type);
            }
        });
    },

    validatePrefs: function(event) {
        FPVSOptions.mapping.forEach(function(mapping) {
            var elt_id = mapping[0];
            var elt = document.getElementById(elt_id);
            var pref = mapping[1];
            var pref_type = mapping[2];
            var pref_func;
            switch (pref_type) {
            case "int":
                fpvsUtils.prefBranch.setIntPref(pref, elt.value);
                break;
            case "bool":
                fpvsUtils.prefBranch.setBoolPref(pref, elt.checked);
                break;
            case "string":
                fpvsUtils.prefBranch.setStringPref(pref, elt.value);
                break;
            case "char":
                fpvsUtils.prefBranch.setCharPref(pref, elt.value);
                break;
            default:
                throw new Error("Unrecognized pref type: " + pref_type);
            }
        });
        return true;
    },

    onUnload: function() {
        fpvsUtils.uninit();
    }
};

fpvsUtils.addEventListener(window, "load", FPVSOptions.onLoad, false);
fpvsUtils.addEventListener(window, "unload", FPVSOptions.onUnload, false);