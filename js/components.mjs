
import { calcBending } from "./app.mjs";

const checkFields = () => {
    let has_err = false;
    jQuery('td').each(function () {
        const input = jQuery(this).find('input');
        if (input.length == 0) return;
        const dropdown = jQuery(this).find('.ui.dropdown');
        if (input.val() === '') {
            jQuery(this).addClass('error');
            dropdown.addClass('error');
            has_err = true;
        }
    });
    return has_err;
};

const checkProps = () => {
    let has_err = false;
    // extract and validate (additional check) data from props:
    const DAT = ACI.UI.data;
    const fields = Object.keys(DAT);
    if (fields.length < 4) return true;
    else {
        var nans = fields.filter(field => {
            DAT[field] = parseFloat(DAT[field]);
            return isNaN(DAT[field]);
        });
    }
    if (nans.length > 0) has_err = true;
    return has_err;
}

const removeErrorClass = id => {
    const td = jQuery(`#${id}`);
    td.removeClass('error');
    td.find('.ui.dropdown').removeClass('error');
};

const tableRow = () => {
    const comp_options = {
        data: function () {
            return {
                table_rows: [1],
                depths: [300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800],
                widths: [250, 300, 350, 400, 450, 500, 550, 600],
                b_arr: [''],
                h_arr: [''],
                results: []
            }
        },
        methods: {
            removeErr: function (id) {
                removeErrorClass(id);
            },
            runCalc: function (dat) {
                if (!checkFields() && !checkProps()) calcBending();
                // else alert('err');
            }
        },
        mounted: function () {
            jQuery('.ui.dropdown').dropdown();
            ACI.v_EVENT.$on('add_row', dat => {
                const last_no = this.table_rows[(this.table_rows).length - 1];
                if (last_no < 0 || !last_no) {
                    (this.table_rows).push(1);
                    (this.b_arr).push(null);
                    (this.h_arr).push(null);
                    this.$nextTick(() => {
                        jQuery('#b-selection-1').dropdown();
                        jQuery('#h-selection-1').dropdown();
                    });

                } else {
                    (this.table_rows).push(last_no + 1);
                    (this.b_arr).push('');
                    (this.h_arr).push('');
                    // activate the dropdowns within the next tick:
                    this.$nextTick(() => {
                        jQuery(`#b-selection-${last_no + 1}`).dropdown();
                        jQuery(`#h-selection-${last_no + 1}`).dropdown();
                    });
                    (this.is_b_empty).push(false);
                    (this.is_h_empty).push(false);
                }
            });
            ACI.v_EVENT.$on('delete_row', dat => {
                (this.table_rows).pop();
                (this.b_arr).pop();
                (this.h_arr).pop();
            });
            ACI.v_EVENT.$on('run', dat => {
                this.runCalc();
            });
        },
        props: {
            passed: Object
        },
        template: `
        <tbody>
            <tr v-for="(row, i) in table_rows" class="center aligned" :key="row">
                <td :id="'td-b' + i">
                    <div :id="'b-selection-' + (i + 1)" class="ui inline dropdown">
                        <input type="hidden" :name="'b' + row" v-model.lazy="b_arr[i]" @change="removeErr('td-b' + i)">
                        <div class="default text">Select</div>
                        <div class="menu">
                            <div class="item" v-for="width in widths" :data-value="width">{{width}}</div>
                        </div>
                     </div>
                </td>
                <td :id="'td-h' + i">
                    <div :id="'h-selection-' + (i + 1)" class="ui inline dropdown">
                        <input type="hidden" :name="'h' + row" v-model.lazy="h_arr[i]" @change="removeErr('td-h' + i)">
                        <div class="default text">Select</div>
                        <div class="menu">
                            <div class="item" v-for="depth in depths" :data-value="depth">{{depth}}</div>
                        </div>
                     </div>
                </td>
                <template v-for="rebar in passed.rebars">
                    <td v-for="pc in passed.pcs">
                        {{pc}}-{{rebar}} kNm
                    </td>
                    </template>
                <td v-for="spac in passed.spacs">{{spac}} kN</td>
                <td>d / 2</td>
            <tr/>
        </tbody>
        `
    };
    return comp_options;
};

export function tableBody() {
    const comp_options = {
        components: {
            table_row: tableRow()
        },
        data: function () {
            return {
                rebars: [16, 20, 25],
                pcs: [2, 3, 4],
                spacs: [100, 150, 200]
            }
        },
        mounted: function () {
            ACI.v_EVENT.$on('add_row', evt => {

            });
        },
        template: `
        <table id="table-app" class="ui celled structured table">
            <thead>
            <tr class="center aligned">
                <th rowspan="1" colspan="2">Beam Size</th>
                <th rowspan="1" colspan="9">Rebar and Bending Moment Capacity, &phi; = 0.90</th>
                <th rowspan="1" colspan="4">Shear Capacity, &phi; = 0.75</th>
            </tr>
            <tr class="small-font center aligned">
                <th>b<br>mm</th>
                <th>h<br>mm</th>
                <template v-for="(rebar,i) in rebars">
                    <th v-for="pc in pcs">{{pc}} - {{rebars[i]}}mm</th>
                </template>
                <th v-for="spac in spacs">{{spac}} mm</th>
                <th>d / 2</th>
            </tr>
            </thead>
            <table_row :passed="{rebars, pcs, spacs}"/>
        </table>
        `
    };
    return comp_options;
};