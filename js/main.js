
const ACI = (function () {
    const j = {};
    j.UI = {};
    return j;
})();

// All jQuery initialisations:
function initUI() {
    // form validations:
    const fields = {
        fc: {
            identifier: 'fc',
            rules: [
                // { type: 'number', prompt: "Please enter a valid number for f'c." },
                { type: 'decimal', prompt: "Please enter a valid number for f'c." }
            ]
        },
        fy: {
            identifier: 'fy',
            rules: [
                // { type: 'number', prompt: 'Please enter a valid number for fy.' },
                { type: 'decimal', prompt: 'Please enter a valid number for fy.' }
            ]
        },
        links: {
            identifier: 'links',
            rules: [
                // { type: 'number', prompt: 'Please enter a valid number for link diameter.' },
                { type: 'decimal', prompt: 'Please enter a valid number for link diameter.' }
            ]
        },
        cc: {
            identifier: 'cc',
            rules: [
                // { type: 'number', prompt: 'Please enter a valid number for clear concrete cover.' },
                // { type: 'decimal', prompt: 'Please enter a valid number for clear concrete cover.' },
                { type: 'regExp[/(^[1]{1}00$)|(^[1-9]{1}[0-9]{1}$)/]', prompt: 'Clear concrete cover should be 10mm to 100mm.' }
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
    // use this instead of v-model to make way for SUI validations:
    const pullData = () => {
        const props = {};
        let input = jQuery('#props-form').find('input');
        jQuery(input).each(function () {
            props[jQuery(this).attr('name')] = jQuery(this).val();
        });
        return props;
    };
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
                    const dat = pullData();
                    if (Object.keys(dat).length == 4) ACI.v_EVENT.$emit('run', dat);
                }
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
