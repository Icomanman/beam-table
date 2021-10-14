
const ACI = (function () {
    const j = {};
    j.UI = {};
    j.UI.data = {};
    j.results = [];
    return j;
})();

// All jQuery initialisations:
function initUI() {
    // form validations:
    const fields = {
        fc: {
            identifier: 'fc',
            rules: [
                { type: 'number', prompt: "Please enter a valid number for f'c." },
                { type: 'decimal', prompt: "Please enter a valid number for f'c." }
            ]
        },
        fy: {
            identifier: 'fy',
            rules: [
                { type: 'number', prompt: 'Please enter a valid number for fy.' },
                { type: 'decimal', prompt: 'Please enter a valid number for fy.' }
            ]
        },
        links: {
            identifier: 'links',
            rules: [
                { type: 'number', prompt: 'Please enter a valid number for link diameter.' },
                { type: 'decimal', prompt: 'Please enter a valid number for link diameter.' }
            ]
        },
        cc: {
            identifier: 'cc',
            rules: [
                { type: 'number', prompt: 'Please enter a valid number for clear concrete cover.' },
                { type: 'decimal', prompt: 'Please enter a valid number for clear concrete cover.' }
            ]
        }

    };
    jQuery('#props-form').form({
        on: 'blur',
        fields,
        onFailure: () => false,
        onSuccess: () => false
    });
}

function App() {
    // Vue event bus
    (function () {
        ACI.v_EVENT = new Vue();
    })();

    // Vue Root
    (function () {
        const { tableBody } = ACI.UI;
        const vue_options = {
            components: {
                // table body component:
                table_comp: tableBody(),
            },
            data: function () {
                return {
                    year: new Date().getFullYear(),
                    shared: ACI.UI.data
                };
            },
            el: "#app",
            methods: {
                addRow: function () {
                    ACI.v_EVENT.$emit('add_row');
                },
                deleteRow: function () {
                    ACI.v_EVENT.$emit('delete_row');
                },
                runTable: function () {
                }
            },
            mounted: function () {
                // console.log(`> ACI.v_UI mounted.`);
            },
            name: "aci-beam-app"
        };
        ACI.v_UI = new Vue(vue_options);
    })();
};

jQuery(document).ready(function () {
    App();
    initUI();
});
