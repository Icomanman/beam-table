
export function tableBody() {
    const comp_options = {
        data: function () {
            return {
                table_rows: [1, 2, 3, 4, 5]
            }
        },
        methods: {
            updateValue: function (evt, key) {

            }
        },
        mounted: function () {
            ACI.v_EVENT.$on('add_row', evt => {

            });
        },
        template: `
        <div class="container">
            <tr 
                v-for="(row, i) in table_rows"
                :id="'table-row-' + i" 
                :key="row"
                >
                <td class="ui dropdown">
                    <select
                        class="ui dropdown"
                        :name="'row' + i"
                        @change="updateValue">
                    <option selected value="1">Type 1</option>
                    <option value="2">Type 2</option>
                    </select>
                </td>
            </tr>
            Sample
        </div>
        `
    };
    return comp_options;
};