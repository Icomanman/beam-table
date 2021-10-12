
const tableRow = () => {
    const comp_options = {
        data: function () {
            return {
                table_rows: [1, 2, 3, 4, 5],
                depths: [300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800],
                widths: [250, 300, 350, 400, 450, 500, 550, 600]
            }
        },
        methods: {
            updateValue: function (evt, key) {

            }
        },
        mounted: function () {
            jQuery('.ui.dropdown').dropdown()
        },
        template: `
        <tbody>
            <tr v-for="row in table_rows">
                <td>
                    <div class="ui selection dropdown">
                        <input type="hidden" name="b">
                        <i class="dropdown icon"></i>
                        <div class="default text">250 mm</div>
                        <div class="menu">
                            <div class="item" v-for="(width, i) in widths" :data-value="i">{{width}} mm</div>
                        </div>
                     </div>
                </td>
                <td>
                    <div class="ui selection dropdown">
                        <input type="hidden" name="h">
                        <i class="dropdown icon"></i>
                        <div class="default text">300 mm</div>
                        <div class="menu">
                            <div class="item" v-for="(depth, j) in depths" :data-value="j">{{depth}} mm</div>
                        </div>
                     </div>
                </td>
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
                <th>b</th>
                <th>h</th>
                <template v-for="(rebar,i) in rebars">
                    <th v-for="pc in pcs">{{pc}} - {{rebars[i]}}mm</th>
                </template>
                <th v-for="spac in spacs">{{spac}} mm</th>
                <th>d / 2</th>
            </tr>
            </thead>
            <table_row/>
        </table>
        `
    };
    return comp_options;
};