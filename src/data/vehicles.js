// Australian EV market database — all drive-away prices approximate for 2026
// insurance_group: 'low' (<$45k), 'mid' ($45k-$80k), 'high' (>$80k)
// fbt_exempt: true = BEV under LCT threshold ($91,387). PHEVs always false post-April 2025.

export const VEHICLES = [
  // ── TESLA ───────────────────────────────────────────────────────────────
  {
    brand: 'Tesla',
    models: [
      {
        model: 'Model 3',
        variants: [
          {
            name: 'Model 3 RWD',
            price_driveaway: 58900,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 513,
            consumption_kWh_per_100km: 14.9,
            driveType: 'RWD',
            seats: 5,
            insurance_group: 'mid',
          },
          {
            name: 'Model 3 Long Range AWD',
            price_driveaway: 73900,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 629,
            consumption_kWh_per_100km: 14.5,
            driveType: 'AWD',
            seats: 5,
            insurance_group: 'mid',
          },
          {
            name: 'Model 3 Performance AWD',
            price_driveaway: 82900,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 528,
            consumption_kWh_per_100km: 15.7,
            driveType: 'AWD',
            seats: 5,
            insurance_group: 'high',
          },
        ],
      },
      {
        model: 'Model Y',
        variants: [
          {
            name: 'Model Y RWD',
            price_driveaway: 60900,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 455,
            consumption_kWh_per_100km: 15.5,
            driveType: 'RWD',
            seats: 5,
            insurance_group: 'mid',
          },
          {
            name: 'Model Y Long Range AWD',
            price_driveaway: 72900,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 533,
            consumption_kWh_per_100km: 16.2,
            driveType: 'AWD',
            seats: 5,
            insurance_group: 'mid',
          },
          {
            name: 'Model Y Performance AWD',
            price_driveaway: 76900,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 514,
            consumption_kWh_per_100km: 17.0,
            driveType: 'AWD',
            seats: 5,
            insurance_group: 'mid',
          },
        ],
      },
    ],
  },

  // ── BYD ─────────────────────────────────────────────────────────────────
  {
    brand: 'BYD',
    models: [
      {
        model: 'Dolphin',
        variants: [
          {
            name: 'Dolphin Dynamic',
            price_driveaway: 38890,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 340,
            consumption_kWh_per_100km: 13.5,
            driveType: 'FWD',
            seats: 5,
            insurance_group: 'low',
          },
          {
            name: 'Dolphin Premium',
            price_driveaway: 42890,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 427,
            consumption_kWh_per_100km: 14.0,
            driveType: 'FWD',
            seats: 5,
            insurance_group: 'low',
          },
        ],
      },
      {
        model: 'Atto 3',
        variants: [
          {
            name: 'Atto 3 Standard Range',
            price_driveaway: 44990,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 420,
            consumption_kWh_per_100km: 15.0,
            driveType: 'FWD',
            seats: 5,
            insurance_group: 'low',
          },
          {
            name: 'Atto 3 Extended Range',
            price_driveaway: 50990,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 480,
            consumption_kWh_per_100km: 15.5,
            driveType: 'FWD',
            seats: 5,
            insurance_group: 'mid',
          },
        ],
      },
      {
        model: 'Seal',
        variants: [
          {
            name: 'Seal Standard Range',
            price_driveaway: 55490,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 460,
            consumption_kWh_per_100km: 16.0,
            driveType: 'RWD',
            seats: 5,
            insurance_group: 'mid',
          },
          {
            name: 'Seal Performance AWD',
            price_driveaway: 73490,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 520,
            consumption_kWh_per_100km: 17.2,
            driveType: 'AWD',
            seats: 5,
            insurance_group: 'mid',
          },
        ],
      },
      {
        model: 'Sealion 7',
        variants: [
          {
            name: 'Sealion 7 Premium',
            price_driveaway: 59990,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 456,
            consumption_kWh_per_100km: 16.5,
            driveType: 'RWD',
            seats: 5,
            insurance_group: 'mid',
          },
          {
            name: 'Sealion 7 Performance',
            price_driveaway: 68990,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 420,
            consumption_kWh_per_100km: 17.8,
            driveType: 'AWD',
            seats: 5,
            insurance_group: 'mid',
          },
        ],
      },
    ],
  },

  // ── HYUNDAI ─────────────────────────────────────────────────────────────
  {
    brand: 'Hyundai',
    models: [
      {
        model: 'IONIQ 5',
        variants: [
          {
            name: 'IONIQ 5 Standard Range RWD',
            price_driveaway: 57400,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 430,
            consumption_kWh_per_100km: 16.5,
            driveType: 'RWD',
            seats: 5,
            insurance_group: 'mid',
          },
          {
            name: 'IONIQ 5 Long Range RWD',
            price_driveaway: 67000,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 507,
            consumption_kWh_per_100km: 16.8,
            driveType: 'RWD',
            seats: 5,
            insurance_group: 'mid',
          },
          {
            name: 'IONIQ 5 Long Range AWD',
            price_driveaway: 77000,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 481,
            consumption_kWh_per_100km: 17.9,
            driveType: 'AWD',
            seats: 5,
            insurance_group: 'mid',
          },
        ],
      },
      {
        model: 'IONIQ 6',
        variants: [
          {
            name: 'IONIQ 6 Standard Range RWD',
            price_driveaway: 62000,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 519,
            consumption_kWh_per_100km: 14.3,
            driveType: 'RWD',
            seats: 5,
            insurance_group: 'mid',
          },
          {
            name: 'IONIQ 6 Long Range RWD',
            price_driveaway: 72000,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 614,
            consumption_kWh_per_100km: 13.9,
            driveType: 'RWD',
            seats: 5,
            insurance_group: 'mid',
          },
        ],
      },
    ],
  },

  // ── KIA ──────────────────────────────────────────────────────────────────
  {
    brand: 'Kia',
    models: [
      {
        model: 'EV6',
        variants: [
          {
            name: 'EV6 Standard Range RWD',
            price_driveaway: 60590,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 394,
            consumption_kWh_per_100km: 17.0,
            driveType: 'RWD',
            seats: 5,
            insurance_group: 'mid',
          },
          {
            name: 'EV6 Long Range RWD',
            price_driveaway: 72590,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 528,
            consumption_kWh_per_100km: 14.7,
            driveType: 'RWD',
            seats: 5,
            insurance_group: 'mid',
          },
          {
            name: 'EV6 GT AWD',
            price_driveaway: 86490,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 424,
            consumption_kWh_per_100km: 18.5,
            driveType: 'AWD',
            seats: 5,
            insurance_group: 'high',
          },
        ],
      },
      {
        model: 'EV9',
        variants: [
          {
            name: 'EV9 Air RWD',
            price_driveaway: 106000,
            vehicle_type: 'BEV',
            fbt_exempt: false,
            range_km: 560,
            consumption_kWh_per_100km: 19.5,
            driveType: 'RWD',
            seats: 7,
            insurance_group: 'high',
          },
        ],
      },
    ],
  },

  // ── MG ───────────────────────────────────────────────────────────────────
  {
    brand: 'MG',
    models: [
      {
        model: 'ZS EV',
        variants: [
          {
            name: 'ZS EV Excite',
            price_driveaway: 40990,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 320,
            consumption_kWh_per_100km: 16.2,
            driveType: 'FWD',
            seats: 5,
            insurance_group: 'low',
          },
          {
            name: 'ZS EV Essence',
            price_driveaway: 47990,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 320,
            consumption_kWh_per_100km: 16.2,
            driveType: 'FWD',
            seats: 5,
            insurance_group: 'mid',
          },
        ],
      },
      {
        model: 'MG4',
        variants: [
          {
            name: 'MG4 Excite 64',
            price_driveaway: 38990,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 435,
            consumption_kWh_per_100km: 16.0,
            driveType: 'RWD',
            seats: 5,
            insurance_group: 'low',
          },
          {
            name: 'MG4 Essence 64',
            price_driveaway: 44990,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 435,
            consumption_kWh_per_100km: 16.0,
            driveType: 'RWD',
            seats: 5,
            insurance_group: 'low',
          },
          {
            name: 'MG4 XPOWER AWD',
            price_driveaway: 52990,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 385,
            consumption_kWh_per_100km: 18.0,
            driveType: 'AWD',
            seats: 5,
            insurance_group: 'mid',
          },
        ],
      },
    ],
  },

  // ── POLESTAR ─────────────────────────────────────────────────────────────
  {
    brand: 'Polestar',
    models: [
      {
        model: 'Polestar 2',
        variants: [
          {
            name: 'Polestar 2 Standard Range Single Motor',
            price_driveaway: 67990,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 518,
            consumption_kWh_per_100km: 14.9,
            driveType: 'RWD',
            seats: 5,
            insurance_group: 'mid',
          },
          {
            name: 'Polestar 2 Long Range Dual Motor',
            price_driveaway: 82990,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 592,
            consumption_kWh_per_100km: 16.2,
            driveType: 'AWD',
            seats: 5,
            insurance_group: 'high',
          },
        ],
      },
    ],
  },

  // ── VOLVO ────────────────────────────────────────────────────────────────
  {
    brand: 'Volvo',
    models: [
      {
        model: 'XC40 Recharge',
        variants: [
          {
            name: 'XC40 Recharge Pure Electric',
            price_driveaway: 79990,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 418,
            consumption_kWh_per_100km: 17.0,
            driveType: 'AWD',
            seats: 5,
            insurance_group: 'high',
          },
        ],
      },
      {
        model: 'C40 Recharge',
        variants: [
          {
            name: 'C40 Recharge Pure Electric',
            price_driveaway: 83990,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 437,
            consumption_kWh_per_100km: 17.2,
            driveType: 'AWD',
            seats: 5,
            insurance_group: 'high',
          },
        ],
      },
    ],
  },

  // ── BMW ──────────────────────────────────────────────────────────────────
  {
    brand: 'BMW',
    models: [
      {
        model: 'iX1',
        variants: [
          {
            name: 'iX1 xDrive30',
            price_driveaway: 75900,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 440,
            consumption_kWh_per_100km: 16.9,
            driveType: 'AWD',
            seats: 5,
            insurance_group: 'mid',
          },
        ],
      },
      {
        model: 'i4',
        variants: [
          {
            name: 'i4 eDrive40',
            price_driveaway: 89900,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 590,
            consumption_kWh_per_100km: 16.4,
            driveType: 'RWD',
            seats: 5,
            insurance_group: 'high',
          },
          {
            name: 'i4 M50 AWD',
            price_driveaway: 116900,
            vehicle_type: 'BEV',
            fbt_exempt: false,
            range_km: 521,
            consumption_kWh_per_100km: 18.6,
            driveType: 'AWD',
            seats: 5,
            insurance_group: 'high',
          },
        ],
      },
    ],
  },

  // ── MERCEDES-BENZ ────────────────────────────────────────────────────────
  {
    brand: 'Mercedes-Benz',
    models: [
      {
        model: 'EQA',
        variants: [
          {
            name: 'EQA 250+',
            price_driveaway: 79900,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 560,
            consumption_kWh_per_100km: 15.7,
            driveType: 'FWD',
            seats: 5,
            insurance_group: 'high',
          },
        ],
      },
      {
        model: 'EQE SUV',
        variants: [
          {
            name: 'EQE 350 SUV',
            price_driveaway: 115900,
            vehicle_type: 'BEV',
            fbt_exempt: false,
            range_km: 590,
            consumption_kWh_per_100km: 19.8,
            driveType: 'RWD',
            seats: 5,
            insurance_group: 'high',
          },
        ],
      },
    ],
  },

  // ── NISSAN ───────────────────────────────────────────────────────────────
  {
    brand: 'Nissan',
    models: [
      {
        model: 'Leaf',
        variants: [
          {
            name: 'Leaf e+ N-Connecta',
            price_driveaway: 50490,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 385,
            consumption_kWh_per_100km: 18.0,
            driveType: 'FWD',
            seats: 5,
            insurance_group: 'mid',
          },
        ],
      },
      {
        model: 'Ariya',
        variants: [
          {
            name: 'Ariya 63kWh FWD',
            price_driveaway: 65490,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 403,
            consumption_kWh_per_100km: 15.5,
            driveType: 'FWD',
            seats: 5,
            insurance_group: 'mid',
          },
        ],
      },
    ],
  },

  // ── MITSUBISHI (PHEV) ────────────────────────────────────────────────────
  {
    brand: 'Mitsubishi',
    models: [
      {
        model: 'Outlander PHEV',
        variants: [
          {
            name: 'Outlander PHEV ES',
            price_driveaway: 52490,
            vehicle_type: 'PHEV',
            fbt_exempt: false,
            range_km: 87,
            consumption_kWh_per_100km: 22.0,
            fuel_consumption_L_per_100km: 1.9,
            driveType: 'AWD',
            seats: 7,
            insurance_group: 'mid',
          },
          {
            name: 'Outlander PHEV Aspire',
            price_driveaway: 62990,
            vehicle_type: 'PHEV',
            fbt_exempt: false,
            range_km: 87,
            consumption_kWh_per_100km: 22.0,
            fuel_consumption_L_per_100km: 1.9,
            driveType: 'AWD',
            seats: 7,
            insurance_group: 'mid',
          },
        ],
      },
    ],
  },

  // ── TOYOTA ───────────────────────────────────────────────────────────────
  {
    brand: 'Toyota',
    models: [
      {
        model: 'bZ4X',
        variants: [
          {
            name: 'bZ4X FWD',
            price_driveaway: 59990,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 470,
            consumption_kWh_per_100km: 16.6,
            driveType: 'FWD',
            seats: 5,
            insurance_group: 'mid',
          },
          {
            name: 'bZ4X AWD',
            price_driveaway: 68490,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 436,
            consumption_kWh_per_100km: 18.0,
            driveType: 'AWD',
            seats: 5,
            insurance_group: 'mid',
          },
        ],
      },
    ],
  },

  // ── SUBARU ───────────────────────────────────────────────────────────────
  {
    brand: 'Subaru',
    models: [
      {
        model: 'Solterra',
        variants: [
          {
            name: 'Solterra AWD',
            price_driveaway: 69990,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 460,
            consumption_kWh_per_100km: 18.1,
            driveType: 'AWD',
            seats: 5,
            insurance_group: 'mid',
          },
        ],
      },
    ],
  },

  // ── VOLKSWAGEN ───────────────────────────────────────────────────────────
  {
    brand: 'Volkswagen',
    models: [
      {
        model: 'ID.4',
        variants: [
          {
            name: 'ID.4 Pro',
            price_driveaway: 67990,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 549,
            consumption_kWh_per_100km: 16.6,
            driveType: 'RWD',
            seats: 5,
            insurance_group: 'mid',
          },
          {
            name: 'ID.4 GTX AWD',
            price_driveaway: 83990,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 489,
            consumption_kWh_per_100km: 18.5,
            driveType: 'AWD',
            seats: 5,
            insurance_group: 'high',
          },
        ],
      },
    ],
  },

  // ── AUDI ─────────────────────────────────────────────────────────────────
  {
    brand: 'Audi',
    models: [
      {
        model: 'Q4 e-tron',
        variants: [
          {
            name: 'Q4 40 e-tron',
            price_driveaway: 76900,
            vehicle_type: 'BEV',
            fbt_exempt: true,
            range_km: 491,
            consumption_kWh_per_100km: 16.6,
            driveType: 'RWD',
            seats: 5,
            insurance_group: 'high',
          },
          {
            name: 'Q4 50 e-tron quattro',
            price_driveaway: 92900,
            vehicle_type: 'BEV',
            fbt_exempt: false,
            range_km: 490,
            consumption_kWh_per_100km: 18.2,
            driveType: 'AWD',
            seats: 5,
            insurance_group: 'high',
          },
        ],
      },
    ],
  },
]

// ── Accessor helpers ─────────────────────────────────────────────────────────

export function getBrands() {
  return VEHICLES.map(b => b.brand)
}

export function getModels(brand) {
  return VEHICLES.find(b => b.brand === brand)?.models.map(m => m.model) ?? []
}

export function getVariants(brand, model) {
  return (
    VEHICLES.find(b => b.brand === brand)
      ?.models.find(m => m.model === model)
      ?.variants ?? []
  )
}

export function getVariantData(brand, model, variantName) {
  return getVariants(brand, model).find(v => v.name === variantName) ?? null
}
