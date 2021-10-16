
const Ast = (As, pcs) => As * pcs;

const momentCapacity = (fc, fy, b, h, bar_data) => {
    const { As, pc, cc, links, rebar } = bar_data;
    const depth = parseFloat(h) - (cc + links + (rebar / 2));
    const total_As = Ast(As, pc);
    const a = total_As * fy / (0.85 * fc * parseFloat(b));
    const Mu = 0.9 * total_As * fy * (depth - (a / 2)) / 1000000;
    return { depth, Mu };
};

export const rebar_data = {
    area: [201, 314, 490],
    rebars: [16, 20, 25],
    pcs: [2, 3, 4],
    link_spacs: [100, 150, 200],
    min_spac: 30
};

export function calcBending(fc, fy, moment_data) {
    const { area, pcs, rebars } = rebar_data;
    const { b_arr, h_arr, cc, links } = moment_data;
    const moment_results = b_arr.map(b => []);
    const eff_depths = [];
    b_arr.forEach((b, i) => {
        rebars.forEach((rebar, j) => {
            pcs.forEach(pc => {
                const { depth, Mu } = momentCapacity(fc, fy, b_arr[i], h_arr[i], { As: area[j], pc, cc, links, rebar });
                moment_results[i].push(Mu);
                eff_depths[i] = depth;
            });
        });
    });
    return { eff_depths, moment_results };
}

export function calcShears(fc, fys, eff_depths, moment_data) {
    const { link_spacs } = rebar_data;
    const { b_arr, h_arr, cc, links } = moment_data;
    const shear_results = fys.map(b => []);
    const vc = [];
    const link_As = 0.25 * Math.PI * links ** 2;
    const vs = (fys, depth, link_spac, link_As) => 2 * link_As * fys * depth / link_spac;
    fys.forEach((fy, i) => {
        vc[i] = 0.17 * (fc ** 0.5) * parseFloat(b_arr[i]) * eff_depths[i];
        link_spacs.forEach(spac => {
            const link_shear = vs(fy, eff_depths[i], spac, link_As);
            shear_results[i].push(0.75 * (vc[i] + link_shear) / 1000);
        });
    });
    return shear_results;
}

export function calcSpacing(b_arr, cc, links) {
    const { pcs, rebars } = rebar_data;
    const trans_spac = b_arr.map(b => []);
    b_arr.forEach((b, i) => {
        rebars.forEach(bar => {
            pcs.forEach(pc => {
                trans_spac[i].push((b - 2 * (cc + links) - (bar * pc)) / (pc - 1));
            });
        });
    });
    return trans_spac;
}