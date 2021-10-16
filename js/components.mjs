
import { calcBending, calcShears, calcSpacing, rebar_data } from "./app.mjs";

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

const checkProps = dat => {
    let has_err = false;
    // extract and validate (additional check) data from props:
    const fields = Object.keys(dat);
    if (fields.length < 4) return true;
    else {
        var nans = fields.filter(field => {
            dat[field] = parseFloat(dat[field]);
            return isNaN(dat[field]);
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
                moment_results: [],
                shear_results: [],
                trans_spac: []
            }
        },
        filters: {
            roundOffSpac: function (val) {
                return val >= rebar_data.min_spac ? val.toFixed(0) : '< 30';
            },
            roundOffMoments: function (val) {
                return val > 0 ? `${val.toFixed(2)} kNm` : '0';
            }
        },
        methods: {
            removeErr: function (id) {
                removeErrorClass(id);
            },
            runCalc: function (dat) {
                if (!checkFields() && !checkProps(dat)) {
                    const { fc, fy, links, cc } = dat;
                    this.trans_spac = calcSpacing(this.b_arr, cc, links);
                    const b_arr = this.b_arr;
                    const h_arr = this.h_arr;
                    const moment_data = { b_arr, h_arr, cc, links, trans_spac: this.trans_spac }
                    this.moment_results = calcBending(fc, fy, moment_data);
                };
                // row color to change to #e8e8e8
                // else alert('err');
            }
        },
        mounted: function () {
            jQuery('.ui.dropdown').dropdown();
            // init the results for empty rows:
            this.moment_results = (this.b_arr).map(b => []);
            (this.b_arr).forEach((b, i) => {
                (rebar_data.rebars).forEach((bar) => {
                    (rebar_data.pcs).forEach(pc => {
                        (this.moment_results[i]).push(0);
                    });
                })
            });
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
                }
            });
            ACI.v_EVENT.$on('delete_row', dat => {
                (this.table_rows).pop();
                (this.trans_spac).pop();
                (this.moment_results).pop();
                (this.b_arr).pop();
                (this.h_arr).pop();
            });
            ACI.v_EVENT.$on('run', dat => {
                this.runCalc(dat);
            });
        },
        props: {
            passed: Object
        },
        template: `
        <tbody>
            <tr :id="'spacing-' + row" v-for="(row, i) in table_rows" v-show="trans_spac[i]" class="center aligned" :key="row">
                <td colspan="2">Spacing</td>
                <td v-for="spac in trans_spac[i]">
                    {{spac | roundOffSpac}} mm
                </td>
                <td colspan="4">-</td>
            </tr>
            <tr :id="'results-' + i" v-for="(row, i) in table_rows" class="center aligned" :key="row">
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
                <td v-for="(result, j) in moment_results[i]">
                    {{result | roundOffMoments}}
                </td>
                <td v-for="link_spac in passed.link_spacs">{{link_spac}} kN</td>
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
                rebars: rebar_data.rebars,
                pcs: rebar_data.pcs,
                link_spacs: rebar_data.link_spacs
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
                <th v-for="link_spac in link_spacs">{{link_spac}} mm</th>
                <th>d / 2</th>
            </tr>
            </thead>
            <table_row :passed="{rebars, pcs, link_spacs}"/>
        </table>
        `
    };
    return comp_options;
};