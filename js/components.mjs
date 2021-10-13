
import { calcBending } from "./app.mjs";

const tableRow = () => {
    const comp_options = {
        data: function () {
            return {
                table_rows: [1, 2],
                depths: [300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800],
                widths: [250, 300, 350, 400, 450, 500, 550, 600],
                b_arr: [],
                h_arr: []
            }
        },
        methods: {
            updateValue: function (evt, key) {
                calcBending();
            }
        },
        mounted: function () {
            jQuery('.ui.dropdown').dropdown();
            ACI.v_EVENT.$on('add_row', dat => {
                const last_no = this.table_rows[(this.table_rows).length - 1];
                (this.table_rows).push(last_no + 1);
                // activate the dropdowns within the next tick:
                this.$nextTick(() => {
                    jQuery(`#b-selection-${last_no + 1}`).dropdown();
                    jQuery(`#h-selection-${last_no + 1}`).dropdown();
                });
            });
            ACI.v_EVENT.$on('delete_row', dat => {
                (this.table_rows).pop();
            });
        },
        props: {
            passed: Object
        },
        template: `
        <tbody>
            <tr v-for="(row, i) in table_rows" class="center aligned">
                <td>
                    <div :id="'b-selection-' + (i + 1)" class="ui inline dropdown">
                        <input type="hidden" :name="'b' + (i + 1)">
                        <div class="default text">Select</div>
                        <div class="menu">
                            <div class="item" v-for="(width, j) in widths" :data-value="j">{{width}}</div>
                        </div>
                     </div>
                </td>
                <td>
                    <div :id="'h-selection-' + (i + 1)" class="ui inline dropdown">
                        <input type="hidden" :name="'h' + (i + 1)">
                        <div class="default text">Select</div>
                        <div class="menu">
                            <div class="item" v-for="(depth, k) in depths" :data-value="k">{{depth}}</div>
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