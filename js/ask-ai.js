/**
 * Semzolve AI Assistant - Global Floating Widget
 * Enables interactive chemical inquiries, specification checks, and quote generation across all site pages.
 */
(function() {
  if (window.__SEMZOLVE_ASK_AI_INITIALIZED__) return;
  window.__SEMZOLVE_ASK_AI_INITIALIZED__ = true;

  // 1. Inject Styles if not already loaded
  if (!document.getElementById('semzolveAskAiStyles')) {
    const st = document.createElement('style');
    st.id = 'semzolveAskAiStyles';
    st.textContent = `
      .fab {
        position: fixed !important;
        right: clamp(16px, 2.5vw, 32px) !important;
        bottom: clamp(16px, 2.5vw, 32px) !important;
        z-index: 9999 !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 10px !important;
        padding: 12px 20px 12px 14px !important;
        border-radius: 999px !important;
        border: 1px solid rgba(228, 246, 254, 0.2) !important;
        cursor: pointer !important;
        background: #030A24 !important;
        color: #F4F8FB !important;
        font-family: 'Schibsted Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        box-shadow: 0 14px 40px -12px rgba(5, 22, 15, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.1) inset !important;
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, opacity 0.3s ease !important;
        opacity: 1 !important;
        pointer-events: auto !important;
        visibility: visible !important;
        transform: translateY(0) scale(1) !important;
      }
      .fab:hover {
        transform: translateY(-2px) scale(1.02) !important;
        box-shadow: 0 18px 48px -10px rgba(5, 22, 15, 0.9), 0 0 0 1px #05B8FB inset !important;
      }
      .fab .dot {
        width: 28px !important;
        height: 28px !important;
        border-radius: 50% !important;
        background: conic-gradient(from 0deg, #34D6A3, #05B8FB, #34D6A3) !important;
        display: grid !important;
        place-items: center !important;
        color: #030A24 !important;
        font-size: 13px !important;
        font-weight: 800 !important;
        animation: rotateGlow 6s linear infinite !important;
      }
      @keyframes rotateGlow {
        100% { transform: rotate(360deg); }
      }
      .fab[hidden], .chat[hidden] {
        display: none !important;
      }
      .chat {
        position: fixed !important;
        right: clamp(16px, 2.5vw, 32px) !important;
        bottom: clamp(16px, 2.5vw, 32px) !important;
        z-index: 10001 !important;
        width: min(420px, calc(100vw - 32px)) !important;
        height: min(620px, calc(100vh - 100px)) !important;
        background: #FFFFFF !important;
        border: 1px solid #D7E3ED !important;
        border-radius: 22px !important;
        box-shadow: 0 30px 80px -20px rgba(5, 22, 15, 0.5), 0 0 0 1px rgba(0, 0, 0, 0.06) !important;
        display: flex !important;
        flex-direction: column !important;
        overflow: hidden !important;
        transform-origin: bottom right !important;
        animation: popChat 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        font-family: 'Schibsted Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      }
      @keyframes popChat {
        from { opacity: 0; transform: scale(0.95) translateY(12px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
      }
      .chat .ch {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
        padding: 14px 18px !important;
        background: #030A24 !important;
        color: #F4F8FB !important;
        border-bottom: 1px solid rgba(228, 246, 254, 0.16) !important;
      }
      .chat .ch .dot {
        width: 32px !important;
        height: 32px !important;
        border-radius: 50% !important;
        background: conic-gradient(from 0deg, #34D6A3, #05B8FB, #34D6A3) !important;
        display: grid !important;
        place-items: center !important;
        color: #030A24 !important;
        font-weight: 800 !important;
        font-size: 14px !important;
        flex: none !important;
      }
      .chat .ch b {
        display: block !important;
        font-size: 15px !important;
        font-weight: 700 !important;
        color: #FFFFFF !important;
        letter-spacing: -0.01em !important;
      }
      .chat .ch small {
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
        font-size: 11.5px !important;
        color: #94A3B8 !important;
      }
      .chat .ch small i {
        width: 7px !important;
        height: 7px !important;
        border-radius: 50% !important;
        background: #34D6A3 !important;
        box-shadow: 0 0 6px #34D6A3 !important;
      }
      .chat .ch button {
        margin-left: auto !important;
        background: transparent !important;
        border: 0 !important;
        color: #F4F8FB !important;
        cursor: pointer !important;
        width: 32px !important;
        height: 32px !important;
        border-radius: 8px !important;
        font-size: 22px !important;
        line-height: 1 !important;
        display: grid !important;
        place-items: center !important;
        transition: background 0.15s ease !important;
      }
      .chat .ch button:hover {
        background: rgba(255, 255, 255, 0.1) !important;
      }
      .msgs {
        flex: 1 !important;
        overflow-y: auto !important;
        padding: 16px !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 12px !important;
        background: #F4F8FB !important;
      }
      .m {
        max-width: 90% !important;
        padding: 11px 15px !important;
        border-radius: 16px !important;
        font-size: 14px !important;
        line-height: 1.5 !important;
        overflow-wrap: anywhere !important;
      }
      .m.u {
        align-self: flex-end !important;
        background: #061649 !important;
        color: #F4F8FB !important;
        border-bottom-right-radius: 4px !important;
      }
      .m.a {
        align-self: flex-start !important;
        background: #FFFFFF !important;
        border: 1px solid #D7E3ED !important;
        color: #061649 !important;
        border-bottom-left-radius: 4px !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
      }
      .m.a p { margin: 0 0 8px 0 !important; }
      .m.a p:last-child { margin: 0 !important; }
      .m.a ul { margin: 4px 0 6px 18px !important; padding: 0 !important; }
      .m.a li { margin-bottom: 3px !important; }
      .m.a b { color: #05B8FB !important; font-weight: 700 !important; }
      .pc { display: grid !important; gap: 8px !important; margin-top: 10px !important; }
      .pc > div {
        display: grid !important;
        grid-template-columns: 1fr auto !important;
        gap: 4px 10px !important;
        align-items: center !important;
        border: 1px solid #D7E3ED !important;
        border-radius: 12px !important;
        padding: 10px 12px !important;
        background: #F4F8FB !important;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03) !important;
      }
      .pc b { font-size: 13.5px !important; font-weight: 700 !important; color: #061649 !important; }
      .pc span { font-size: 12px !important; color: #55657F !important; grid-column: 1 !important; }
      .pc .add {
        grid-row: 1 / span 2 !important;
        grid-column: 2 !important;
        padding: 6px 12px !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        border-radius: 99px !important;
        border: 1px solid #05B8FB !important;
        color: #05B8FB !important;
        background: transparent !important;
        cursor: pointer !important;
        transition: all 0.15s ease !important;
        white-space: nowrap !important;
      }
      .pc .add:hover, .pc .add.added {
        background: #05B8FB !important;
        color: #ffffff !important;
      }
      .qs {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 6px !important;
        padding: 0 16px 12px !important;
        background: #F4F8FB !important;
      }
      .qs button {
        font-family: inherit !important;
        font-size: 12.5px !important;
        font-weight: 500 !important;
        border: 1px solid #D7E3ED !important;
        background: #FFFFFF !important;
        color: #061649 !important;
        border-radius: 99px !important;
        padding: 6px 12px !important;
        cursor: pointer !important;
        transition: all 0.15s ease !important;
      }
      .qs button:hover {
        border-color: #05B8FB !important;
        color: #0369A1 !important;
        background: #E4F6FE !important;
      }
      .cin {
        display: flex !important;
        gap: 8px !important;
        padding: 12px 14px !important;
        border-top: 1px solid #D7E3ED !important;
        background: #FFFFFF !important;
      }
      .cin input {
        flex: 1 !important;
        min-width: 0 !important;
        font-family: inherit !important;
        font-size: 14px !important;
        color: #061649 !important;
        background: #F4F8FB !important;
        border: 1px solid #D7E3ED !important;
        border-radius: 999px !important;
        padding: 10px 16px !important;
      }
      .cin input:focus {
        outline: none !important;
        border-color: #05B8FB !important;
      }
      .cin button {
        flex: none !important;
        width: 40px !important;
        height: 40px !important;
        border-radius: 50% !important;
        border: 0 !important;
        background: #05B8FB !important;
        color: #ffffff !important;
        display: grid !important;
        place-items: center !important;
        cursor: pointer !important;
        transition: background 0.15s ease, transform 0.15s ease !important;
      }
      .cin button:hover {
        background: #0369A1 !important;
        transform: scale(1.05) !important;
      }
      .cfoot {
        font-size: 11px !important;
        color: #55657F !important;
        text-align: center !important;
        padding: 0 12px 10px !important;
        background: #FFFFFF !important;
      }
      .toast-pill {
        position: fixed !important;
        left: 50% !important;
        bottom: calc(24px + env(safe-area-inset-bottom, 0px)) !important;
        transform: translateX(-50%) translateY(20px) !important;
        opacity: 0 !important;
        pointer-events: none !important;
        background: #030A24 !important;
        color: #ffffff !important;
        padding: 12px 22px !important;
        border-radius: 999px !important;
        font-family: inherit !important;
        font-weight: 600 !important;
        font-size: 14px !important;
        box-shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.12) !important;
        z-index: 10002 !important;
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
      }
      .toast-pill.show {
        transform: translateX(-50%) translateY(0) !important;
        opacity: 1 !important;
        pointer-events: auto !important;
      }
      .toast-pill a {
        color: #05B8FB !important;
        text-decoration: underline !important;
        font-weight: 700 !important;
      }
      body:has(#chatFab:not([hidden])) .floating-back-to-top,
      body:has(.fab:not([hidden])) .floating-back-to-top,
      body.has-chat-fab .floating-back-to-top {
        bottom: clamp(76px, calc(2.5vw + 58px), 94px) !important;
      }
      body:has(.chat:not([hidden])) .floating-back-to-top {
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(st);
  }

  // 2. Chemical Catalog Data
  const CATALOG = {"cats": ["Speciality Solvents & Glycol Esters", "Petrochemicals & Solvents", "Pharma & Agrochem Intermediates", "Industrial Chemicals, Plasticizers & Acids", "Cosmetic Ingredients & Perfumery Chemicals", "Emulsions, Construction Chemicals & Additives (BASF)"], "cos": [], "rows": [["Methanol", "67-56-1", 1, 0, "Feedstock for formaldehyde, acetic acid, biodiesel; industrial solvent", "CH4O", 32.04, "", "", "Methyl alcohol | Wood alcohol | Carbinol"], ["Methoxypropyl Acetate", "108-65-6", 0, 0, "Coating industry", "C6H12O3", 132.16, "", "", "PGMEA | Propylene glycol methyl ether acetate | 1-Methoxy-2-propyl acetate | PMA"], ["n-Butyl Acetate", "123-86-4", 0, 0, "Paint industry", "C6H12O2", 116.16, "", "", "n-Butyl acetate | Butyl acetate | Butyl ethanoate"], ["Ethyl Acetate", "141-78-6", 1, 0, "Solvent for glues, inks, paints, nail-polish remover; decaffeination", "C4H8O2", 88.11, "", "", "Ethyl acetate | Ethyl ethanoate | EtOAc"], ["1,3-Cyclohexanedione", "504-02-9", 2, 0, "Carvedilol, ondansetron, mesotrione, tembotrione, sulcotrione and other triketone herbicides, nitisinone", "C6H8O2", 112.13, "", "", "Cyclohexane-1,3-dione | Dihydroresorcinol | 1,3-CHD"], ["Acetic Acid", "64-19-7", 3, 0, "Feedstock for VAM, esters, PTA, acetic anhydride", "C2H4O2", 60.05, "", "", "Acetic acid | Glacial acetic acid | Ethanoic acid"], ["Normal Butanol", "71-36-3", 1, 0, "Feedstock for butyl acrylate, butyl acetate, glycol ethers; solvent", "C4H10O", 74.12, "", "", "n-Butanol | 1-Butanol | Butyl alcohol"], ["Propylene Glycol IP / FFG", "57-55-6", 1, 0, "Unsaturated polyester resins, antifreeze, food/pharma excipient (USP)", "C3H8O2", 76.09, "", "", "Propylene glycol | Propane-1,2-diol | MPG"], ["Cyclohexanone", "108-94-1", 1, 0, "Caprolactam/nylon 6 feedstock; solvent for PVC and coatings", "C6H10O", 98.14, "", "", "Anone"], ["(R)-(-)-5-(2-Aminopropyl)-2-Methoxybenzene Sulfonamide", "112101-81-2", 2, 0, "Tamsulosin", "C10H16N2O3S", 244.31, "", "", ""], ["(S)-1-Phenyl-1,2,3,4-Tetrahydroisoquinoline", "118864-75-8", 2, 0, "Solifenacin succinate", "C15H15N", 209.29, "", "", ""], ["1,2,3,9-Tetrahydro-4H-Carbazol-4-one", "15128-52-6", 2, 0, "Carvedilol", "C12H11NO", 185.23, "", "", ""], ["1,2,3,9-Tetrahydro-9-Methyl-4H-Carbazol-4-one", "27387-31-1", 2, 0, "Ondansetron", "C13H13NO", 199.25, "", "", ""], ["1,4-Cyclohexanedione", "637-88-7", 2, 0, "Frovatriptan, delamanid", "C6H8O2", 112.13, "", "", ""], ["1,4-Cyclohexanedione Monoethylene Acetal", "4746-97-8", 2, 0, "Liquid-crystal materials, insecticides", "C8H12O3", 156.18, "", "", ""], ["2,4-Thiazolidinedione", "2295-31-0", 2, 0, "Pioglitazone, rosiglitazone, troglitazone", "C3H3NO2S", 117.12, "", "", ""], ["4-(2,3-Epoxypropoxy)Carbazole", "51997-51-4", 2, 0, "Carvedilol", "C15H13NO2", 239.27, "", "", ""], ["4-(4-Methylpiperazinomethyl)Benzoic Acid Dihydrochloride", "106261-49-8", 2, 0, "Imatinib", "C13H20Cl2N2O2", 307.22, "", "", ""], ["4-(Methylamino)-3-Nitrobenzoic Acid Hydrochloride", "41263-74-5", 2, 0, "Dabigatran", "", 0, "", "", ""], ["4-Bromo-1-Chloro-2-(4-Ethoxybenzyl)Benzene", "461432-23-5", 2, 0, "Dapagliflozin", "C15H14BrClO", 325.63, "", "", ""], ["4-Hydroxycarbazole", "52602-39-8", 2, 0, "Carvedilol", "C12H9NO", 183.21, "", "", ""], ["4-Methylcyclohexanone", "589-92-4", 2, 0, "Glimepiride", "C7H12O", 112.17, "", "", ""], ["Benzalkonium Chloride 50%", "8001-54-5", 2, 0, "Preservative, disinfectant, antibacterial", "", 0, "", "", ""], ["Benzalkonium Chloride 80%", "8001-54-5", 2, 0, "Preservative, disinfectant, antibacterial", "", 0, "", "", ""], ["Benzalkonium Chloride Powder", "8001-54-5", 2, 0, "Antibacterial", "", 0, "", "", ""], ["Benzalkonium Chloride Solution 50% IP", "8001-54-5", 2, 0, "Preservative", "", 0, "", "", ""], ["Ethyl 3-(2-Pyridylamino)Propionate", "103041-38-9", 2, 0, "Dabigatran", "C10H14N2O2", 194.23, "", "", ""], ["Ethyl 3-[3-Amino-4-(Methylamino)-N-(2-Pyridyl)Benzamido]Propionate", "212322-56-0", 2, 0, "Dabigatran", "C18H22N4O3", 342.4, "", "", ""], ["Ethyl Isonipecotate", "1126-09-6", 2, 0, "Solifenacin, tamsulosin, avatrombopag, umeclidinium, fexofenadine, bilastine, efinaconazole, donepezil", "C8H15NO2", 157.21, "", "", ""], ["N-(5-Amino-2-Methylphenyl)-4-(3-Pyridyl)-2-Pyrimidineamine", "152460-10-1", 2, 0, "Imatinib", "C16H15N5", 277.33, "", "", ""], ["Trans-4-Methylcyclohexylamine Hydrochloride", "33483-65-7", 2, 0, "Glimepiride", "C7H16ClN", 149.66, "", "", ""], ["2-Ethylhexyl Acetate", "103-09-3", 0, 0, "Leather chemicals", "C10H20O2", 172.27, "", "", ""], ["Butyl Diglycol Acetate", "124-17-4", 0, 0, "Coil coating", "C10H20O4", 204.27, "", "", ""], ["Butyl Glycol Acetate", "112-07-2", 0, 0, "Automotive coatings", "C8H16O3", 160.21, "", "", ""], ["Dipropylene Glycol Monomethyl Ether Acetate", "88917-22-0", 0, 0, "Fragrance industry", "C9H18O4", 190.24, "", "", ""], ["Ethoxypropyl Acetate", "54839-24-6", 0, 0, "", "C7H14O3", 146.19, "", "", ""], ["Ethyl Diglycol Acetate", "112-15-2", 0, 0, "Paint industry", "C8H16O4", 176.21, "", "", ""], ["Ethyl Ethoxypropionate", "763-69-9", 0, 0, "Coating industry", "C7H14O3", 146.19, "", "", ""], ["Ethyl Glycol Acetate", "111-15-9", 0, 0, "Paint industry", "C6H12O3", 132.16, "", "", ""], ["Ethylene Glycol Diacetate", "111-55-7", 0, 0, "Foundry chemicals", "C6H10O4", 146.14, "", "", ""], ["Ethylene Glycol Dipropionate", "123-80-8", 0, 0, "", "C8H14O4", 174.2, "", "", ""], ["Isoamyl Acetate", "123-92-2", 0, 0, "Coating industry", "C7H14O2", 130.19, "", "", ""], ["Isobutyl Acetate", "110-19-0", 0, 0, "Paint industry", "C6H12O2", 116.16, "", "", ""], ["Isobutyl Propionate", "540-42-1", 0, 0, "Coating industry", "C7H14O2", 130.19, "", "", ""], ["Isopropyl Acetate", "108-21-4", 0, 0, "Pharma, paint industry", "C5H10O2", 102.13, "", "", ""], ["N Pentyl Acetate", "628-63-7", 0, 0, "Coating industry", "C7H14O2", 130.19, "", "", ""], ["n-Butyl Propionate", "590-01-2", 0, 0, "Coating industry", "C7H14O2", 130.19, "", "", ""], ["n-Pentyl Propionate", "624-54-4", 0, 0, "Coating industry", "C8H16O2", 144.21, "", "", ""], ["n-Propyl Propionate", "106-36-5", 0, 0, "Coating industry", "C6H12O2", 116.16, "", "", ""], ["Propylene Glycol Diacetate", "623-84-7", 0, 0, "Coating industry", "C7H12O4", 160.17, "", "", ""], ["Propylene Glycol Monomethyl Ether Propionate", "148462-57-1", 0, 0, "Coating industry", "C7H14O3", 146.19, "", "", ""], ["Triacetin", "102-76-1", 0, 0, "Foundry chemicals", "C9H14O6", 218.2, "", "", ""], ["Diacetone Alcohol", "123-42-2", 1, 0, "", "C6H12O2", 116.16, "", "", ""], ["Dibasic Ester (DBE)", "1119-40-0", 1, 0, "", "C7H12O4", 160.17, "", "", ""], ["Isobutyl Alcohol", "78-83-1", 1, 0, "", "C4H10O", 74.12, "", "", ""], ["Isophorone", "78-59-1", 1, 0, "", "C9H14O", 138.21, "", "", ""], ["Methyl Propyl Ketone (MPK)", "107-87-9", 1, 0, "", "C5H10O", 86.13, "", "", ""], ["Mixed Xylene", "1330-20-7", 1, 0, "", "C8H10", 106.17, "", "", ""], ["Ortho Xylene", "95-47-6", 1, 0, "", "C8H10", 106.17, "", "", ""], ["Phenol", "108-95-2", 1, 0, "", "C6H6O", 94.11, "", "", ""], ["2,4-Diaminopyrimidine-3-N-Oxide Monohydrate", "1189096-02-3", 4, 0, "Hair growth", "C4H8N4O2", 144.13, "", "", ""], ["2-Methylcyclohexanol", "583-59-5", 4, 0, "Perfumery", "C7H14O", 114.19, "", "", ""], ["4-Hexylresorcinol", "136-77-6", 4, 0, "Skin whitening", "C12H18O2", 194.27, "", "", ""], ["4-Methylcyclohexanol", "589-91-3", 4, 0, "Perfumery", "C7H14O", 114.19, "", "", ""], ["4-n-Butylresorcinol", "18979-61-8", 4, 0, "Skin whitening", "C10H14O2", 166.22, "", "", ""], ["Coleus Forskohlii Extract 10%", "66575-29-9", 4, 0, "Nutraceutical, weight management", "", 0, "", "", ""], ["Coleus Forskohlii Extract 20%", "66575-29-9", 4, 0, "Nutraceutical, weight management", "", 0, "", "", ""], ["Coleus Forskohlii Extract 40%", "66575-29-9", 4, 0, "Nutraceutical, weight management", "", 0, "", "", ""], ["Curcumin 98%", "458-37-7", 4, 0, "Nutraceutical, antioxidant", "C21H20O6", 368.38, "", "", ""], ["Curcuminoids 95%", "8024-37-1", 4, 0, "Nutraceutical, antioxidant", "", 0, "", "", ""], ["Ethylhexyl Triazone", "88122-99-0", 4, 0, "Sunscreen UV-B filter", "C48H66N6O6", 823.09, "", "", ""], ["Forskolin 98%", "66575-29-9", 4, 0, "Nutraceutical, weight management", "", 0, "", "", ""], ["Iscotrizinol", "154702-15-5", 4, 0, "UV filter, sun care", "", 0, "", "", ""], ["Piperine 95%", "94-62-2", 4, 0, "Bioavailability enhancer", "C17H19NO3", 285.34, "", "", ""], ["Piroctone Olamine", "68890-66-4", 4, 0, "Anti-dandruff", "C16H30N2O3", 298.43, "", "", ""], ["Tetrahydrocurcumin", "36062-04-1", 4, 0, "Antiseptic, skin care", "C21H24O6", 372.42, "", "", ""], ["Tetrahydropiperine", "23434-88-0", 4, 0, "Anti-acne", "C17H23NO3", 289.38, "", "", ""], ["Acrylamide", "79-06-1", 3, 0, "", "C3H5NO", 71.08, "", "", ""], ["Adipic Acid", "124-04-9", 3, 0, "", "C6H10O4", 146.14, "", "", ""], ["Alpha Olefin Sulphonate (AOS)", "93686-14-7", 3, 0, "", "", 0, "", "", ""], ["Alphox 100 & 200", "9016-45-9", 3, 0, "", "", 0, "", "R", ""], ["Alum", "7784-24-9", 3, 0, "", "AlH24KO20S2", 474.37, "", "", ""], ["Aluminium Stearate (HI Grade)", "637-12-7", 3, 0, "", "", 0, "", "", ""], ["Ammonium Benzoate", "1863-63-4", 3, 0, "", "C7H9NO2", 139.15, "", "", ""], ["Ammonium Bicarbonate", "1066-33-7", 3, 0, "", "CH5NO3", 79.06, "", "", ""], ["Ammonium Chloride", "12125-02-9", 3, 0, "", "ClH4N", 53.49, "", "", ""], ["Ammonium Persulphate", "7727-54-0", 3, 0, "", "H8N2O8S2", 228.19, "", "", ""], ["Amyl Acetate", "628-63-7", 3, 0, "", "C7H14O2", 130.19, "", "", ""], ["Bentec ED-11", "14808-60-7", 3, 0, "", "", 0, "", "", ""], ["Bentec P2", "14808-60-7", 3, 0, "", "", 0, "", "", ""], ["Bentec PLB", "14808-60-7", 3, 0, "", "", 0, "", "", ""], ["Bentec PLC", "14808-60-7", 3, 0, "", "", 0, "", "", ""], ["Bentonite", "1302-78-9", 3, 0, "", "", 0, "", "", ""], ["Benzoic Acid", "65-85-0", 3, 0, "", "C7H6O2", 122.12, "", "", ""], ["Benzotriazole", "95-14-7", 3, 0, "", "C6H5N3", 119.13, "", "", ""], ["Benzyl Alcohol", "100-51-6", 3, 0, "", "C7H8O", 108.14, "", "", ""], ["BHT & BHA", "128-37-0", 3, 0, "", "C15H24O", 220.36, "", "", ""], ["Borax", "1303-96-4", 3, 0, "", "B4H20Na2O17", 381.36, "", "", ""], ["Boric Acid", "10043-35-3", 3, 0, "", "BH3O3", 61.83, "", "", ""], ["Butyl Cellosolve", "111-76-2", 3, 0, "", "C6H14O2", 118.18, "", "", ""], ["Cabosil", "112945-52-5", 3, 0, "", "O2Si", 60.08, "", "", ""], ["Calcium Carbonate (All Grades)", "471-34-1", 3, 0, "", "CCaO3", 100.09, "", "", ""], ["Calcium Chloride (All Grades)", "10043-52-4", 3, 0, "", "CaCl2", 110.98, "", "", ""], ["Calcium Chloride Lye", "10043-52-4", 3, 0, "", "CaCl2", 110.98, "", "", ""], ["Calcium Stearate", "1592-23-0", 3, 0, "", "", 0, "", "", ""], ["Carboxymethyl Cellulose (CMC)", "9004-32-4", 3, 0, "", "", 0, "", "", ""], ["Castrox 200", "111-46-6", 3, 0, "", "", 0, "", "", ""], ["Caustic Potash", "1310-58-3", 3, 0, "", "HKO", 56.11, "", "", ""], ["Caustic Soda", "1310-73-2", 3, 0, "", "HNaO", 40, "", "", ""], ["Caustic Soda Lye", "1310-73-2", 3, 0, "", "HNaO", 40, "", "", ""], ["China Clay", "1332-58-7", 3, 0, "", "Al2H4O9Si2", 258.16, "", "", ""], ["Chloroform", "67-66-3", 3, 0, "", "CHCl3", 119.37, "", "R", ""], ["Citric Acid (Anhydrous & Monohydrate)", "77-92-9", 3, 0, "", "C6H8O7", 192.12, "", "", ""], ["Copper Carbonate", "1184-64-1", 3, 0, "", "CH2Cu2O5", 221.11, "", "", ""], ["Cyclohexane", "110-82-7", 3, 0, "", "C6H12", 84.16, "", "", ""], ["Dextrose Monohydrate", "5996-10-1", 3, 0, "", "C6H14O7", 198.17, "", "", ""], ["Diammonium Phosphate", "7783-28-0", 3, 0, "", "H9N2O4P", 132.06, "", "", ""], ["Dibutyl Phthalate", "84-74-2", 3, 0, "", "C16H22O4", 278.35, "", "R", ""], ["Diethyl Phthalate", "84-66-2", 3, 0, "", "C12H14O4", 222.24, "", "", ""], ["Diethylene Glycol", "111-46-6", 3, 0, "", "C4H10O3", 106.12, "", "", ""], ["Diisopropyl Ether", "108-20-3", 3, 0, "", "C6H14O", 102.18, "", "", ""], ["Dimethyl Sulphoxide", "67-68-5", 3, 0, "", "C2H6OS", 78.13, "", "", ""], ["Dimethylaminoethanol", "108-01-0", 3, 0, "", "C4H11NO", 89.14, "", "", ""], ["Dimethylformamide", "68-12-2", 3, 0, "", "C3H7NO", 73.09, "", "", ""], ["Dioctyl Phthalate (DOP)", "117-81-7", 3, 0, "", "C24H38O4", 390.56, "", "R", ""], ["Dipentene (Camphane, Heavy & Normal)", "138-86-3", 3, 0, "", "C10H16", 136.24, "", "", ""], ["Dipropylene Glycol", "25265-71-8", 3, 0, "", "C6H14O3", 134.18, "", "", ""], ["DMP", "87413-09-0", 3, 0, "", "", 0, "", "", ""], ["EDTA Disodium", "6381-92-6", 3, 0, "", "", 0, "", "", ""], ["EDTA Tetrasodium", "13235-36-4", 3, 0, "", "", 0, "", "", ""], ["Ethoxyquin", "91-53-2", 3, 0, "", "C14H19NO", 217.31, "", "", ""], ["Ethyl Carbitol (EDG)", "111-90-0", 3, 0, "", "C6H14O3", 134.18, "", "", ""], ["Ethyl Vanillin", "121-32-4", 3, 0, "", "C9H10O3", 166.18, "", "", ""], ["Ethylene Glycol Monostearate (EGMS)", "111-60-4", 3, 0, "", "C20H40O3", 328.54, "", "", ""], ["Formaldehyde", "50-00-0", 3, 0, "", "CH2O", 30.03, "", "", ""], ["Glycerine", "56-81-5", 3, 0, "", "C3H8O3", 92.09, "", "", ""], ["Gum Acacia", "9000-01-5", 3, 0, "", "", 0, "", "", ""], ["Hexamine", "100-97-0", 3, 0, "", "C6H12N4", 140.19, "", "", ""], ["Hexylene Glycol", "107-41-5", 3, 0, "", "C6H14O2", 118.18, "", "", ""], ["Hydrobromic Acid", "10035-10-6", 3, 0, "", "BrH", 80.91, "", "", ""], ["Hydrogen Peroxide", "7722-84-1", 3, 0, "", "H2O2", 34.01, "", "", ""], ["Hyflo Super-Cel", "68855-54-9", 3, 0, "", "", 0, "", "", ""], ["Lactic Acid", "79-33-4", 3, 0, "", "C3H6O3", 90.08, "", "", ""], ["Lauryl Alcohol Ethoxylate LA-7 & LA-9", "68439-50-9", 3, 0, "", "", 0, "", "", ""], ["Liquid Paraffin (Light & Heavy)", "8012-95-1", 3, 0, "", "", 0, "", "", ""], ["Liquor Ammonia", "1336-21-6", 3, 0, "", "H5NO", 35.05, "", "", ""], ["Magnesium Sulphate", "7487-88-9", 3, 0, "", "MgO4S", 120.36, "", "", ""], ["Maleic Acid DL", "6915-15-7", 3, 0, "", "C4H4O4", 116.07, "", "", ""], ["Maleic Anhydride", "108-31-6", 3, 0, "", "C4H2O3", 98.06, "", "", ""], ["Manganese Sulphate", "10034-96-5", 3, 0, "", "H2MnO5S", 169.01, "", "", ""], ["Methyl Cellosolve", "109-86-4", 3, 0, "", "C3H8O2", 76.09, "", "", ""], ["Methylene Chloride", "75-09-2", 3, 0, "", "CH2Cl2", 84.93, "", "", ""], ["Mocidate", "", 3, 0, "", "", 0, "", "", ""], ["Monoethanolamine", "141-43-5", 3, 0, "", "C2H7NO", 61.08, "", "", ""], ["Monoethylene Glycol", "107-21-1", 3, 0, "", "C2H6O2", 62.07, "", "", ""], ["Monosodium Phosphate", "10049-21-5", 3, 0, "", "H2NaO4P", 119.98, "", "", ""], ["Morpholine", "110-91-8", 3, 0, "", "C4H9NO", 87.12, "", "", ""], ["N,N-Dimethylaniline", "121-69-7", 3, 0, "", "C8H11N", 121.18, "", "", ""], ["n-Heptane", "142-82-5", 3, 0, "", "C7H16", 100.2, "", "", ""], ["n-Propanol", "71-23-8", 3, 0, "", "C3H8O", 60.1, "", "", ""], ["Neopentyl Glycol", "126-30-7", 3, 0, "", "C5H12O2", 104.15, "", "", ""], ["Nilofoam NDW", "64742-96-7", 3, 0, "", "", 0, "", "", ""], ["Nonyl Phenol", "84852-15-3", 3, 0, "", "", 0, "", "R", ""], ["Nonyl Phenol Ethoxylate N 9.5 & N 4.5", "9016-45-9", 3, 0, "", "", 0, "", "R", ""], ["Octanol", "111-87-5", 3, 0, "", "C8H18O", 130.23, "", "", ""], ["Oleic Acid", "112-80-1", 3, 0, "", "C18H34O2", 282.47, "", "", ""], ["Oxalic Acid", "144-62-7", 3, 0, "", "C2H2O4", 90.03, "", "", ""], ["para-Toluenesulphonic Acid", "6192-52-5", 3, 0, "", "C7H8O3S", 172.2, "", "", ""], ["Paraffin Wax", "8002-74-2", 3, 0, "", "", 0, "", "", ""], ["Paraformaldehyde", "30525-89-4", 3, 0, "", "", 0, "", "", ""], ["Perchloroethylene", "127-18-4", 3, 0, "", "C2Cl4", 165.82, "", "", ""], ["Phosphoric Acid", "7664-38-2", 3, 0, "", "H3O4P", 97.99, "", "", ""], ["Polyaluminium Chloride", "1327-41-9", 3, 0, "", "", 0, "", "", ""], ["Polyethylene Glycol 200, 400 & 600", "25322-68-3", 3, 0, "", "", 0, "", "", ""], ["Polyethylene Glycol 4000 & 6000", "25322-68-3", 3, 0, "", "", 0, "", "", ""], ["Polysorbate (80 & 20)", "9005-64-5", 3, 0, "", "", 0, "", "", ""], ["Polyvinyl Alcohol", "9002-89-5", 3, 0, "", "", 0, "", "", ""], ["Polyvinyl Alcohol Powder", "9002-89-5", 3, 0, "", "", 0, "", "", ""], ["Potassium Carbonate, Granular", "584-08-7", 3, 0, "", "CK2O3", 138.2, "", "", ""], ["Potassium Metabisulphite", "16731-55-8", 3, 0, "", "K2O5S2", 222.31, "", "", ""], ["Potassium Persulphate", "7727-21-1", 3, 0, "", "K2O8S2", 270.31, "", "", ""], ["PPG 2000", "25322-69-4", 3, 0, "", "", 0, "", "", ""], ["Precipitated Silica", "7631-86-9", 3, 0, "", "O2Si", 60.08, "", "", ""], ["Propyl Gallate", "121-79-9", 3, 0, "", "C10H12O5", 212.2, "", "", ""], ["Salicylic Acid (Brown & White)", "69-72-7", 3, 0, "", "C7H6O3", 138.12, "", "", ""], ["Slurry", "27176-87-0", 3, 0, "", "", 0, "", "", ""], ["Soapstone Powder (Talc)", "14807-96-6", 3, 0, "", "H2Mg3O12Si4", 379.26, "", "", ""], ["Soda Ash", "497-19-8", 3, 0, "", "CNa2O3", 105.99, "", "", ""], ["Sodium Acetate", "6131-90-4", 3, 0, "", "C2H9NaO5", 136.08, "", "", ""], ["Sodium Benzoate", "532-32-1", 3, 0, "", "C7H5NaO2", 144.1, "", "", ""], ["Sodium Bicarbonate", "144-55-8", 3, 0, "", "CHNaO3", 84.01, "", "", ""], ["Sodium Bisulphite", "7631-90-5", 3, 0, "", "HNaO3S", 104.06, "", "", ""], ["Sodium Chloride, Free Flow", "7647-14-5", 3, 0, "", "ClNa", 58.44, "", "", ""], ["Sodium Citrate", "68-04-2", 3, 0, "", "C6H5Na3O7", 258.07, "", "", ""], ["Sodium Gluconate", "527-07-1", 3, 0, "", "C6H11NaO7", 218.14, "", "", ""], ["Sodium Hexametaphosphate", "10124-56-8", 3, 0, "", "Na6O18P6", 611.77, "", "", ""], ["Sodium Laureth Sulphate", "9004-82-4", 3, 0, "", "", 0, "", "", ""], ["Sodium Lauryl Sulphate", "151-21-3", 3, 0, "", "C12H25NaO4S", 288.38, "", "", ""], ["Sodium Metabisulphite, Food Grade", "7681-57-4", 3, 0, "", "Na2O5S2", 190.09, "", "", ""], ["Sodium Percarbonate", "15630-89-4", 3, 0, "", "C2H6Na4O12", 314.02, "", "", ""], ["Sodium Silicate", "1344-09-8", 3, 0, "", "Na2O3Si", 122.06, "", "", ""], ["Sodium Stearate", "822-16-2", 3, 0, "", "C18H35NaO2", 306.47, "", "", ""], ["Sodium Sulphate Anhydrous", "7757-82-6", 3, 0, "", "Na2O4S", 142.04, "", "", ""], ["Sodium Sulphite", "7757-83-7", 3, 0, "", "Na2O3S", 126.04, "", "", ""], ["Sodium Thiosulphate", "7772-98-7", 3, 0, "", "H10Na2O8S2", 248.17, "", "", ""], ["Sodium Tripolyphosphate", "7758-29-4", 3, 0, "", "Na5O10P3", 367.86, "", "", ""], ["Sorbitol", "50-70-4", 3, 0, "", "C6H14O6", 182.17, "", "", ""], ["Soya Lecithin", "8002-43-5", 3, 0, "", "", 0, "", "", ""], ["Stearic Acid", "57-11-4", 3, 0, "", "C18H36O2", 284.48, "", "", ""], ["Styrene Monomer", "100-42-5", 3, 0, "", "C8H8", 104.15, "", "", ""], ["Succinic Acid", "110-15-6", 3, 0, "", "C4H6O4", 118.09, "", "", ""], ["Sulphamic Acid", "5329-14-6", 3, 0, "", "H3NO3S", 97.09, "", "", ""], ["Tartaric Acid DL", "133-37-9", 3, 0, "", "C4H6O6", 150.09, "", "", ""], ["TCC-90", "87-90-1", 3, 0, "", "C3Cl3N3O3", 232.4, "", "", ""], ["Tetrahydrofuran (THF)", "109-99-9", 3, 0, "", "C4H8O", 72.11, "", "", ""], ["Titanium Dioxide", "13463-67-7", 3, 0, "", "O2Ti", 79.86, "", "", ""], ["Trichloroethylene (TCE)", "79-01-6", 3, 0, "", "C2HCl3", 131.38, "", "R", ""], ["Triethylamine & Triethanolamine", "121-44-8", 3, 0, "", "C6H15N", 101.19, "", "R", ""], ["Trimethylolpropane", "77-99-6", 3, 0, "", "C6H14O3", 134.18, "", "", ""], ["Trisodium Phosphate", "7601-54-9", 3, 0, "", "H24Na3O16P", 380.12, "", "", ""], ["Turkey Red Oil", "8002-33-3", 3, 0, "", "", 0, "", "", ""], ["Zinc Chloride", "7646-85-7", 3, 0, "", "Cl2Zn", 136.28, "", "", ""], ["Zinc Oxide", "1314-13-2", 3, 0, "", "OZn", 81.38, "", "", ""], ["Zinc Stearate", "557-05-1", 3, 0, "", "", 0, "", "", ""], ["Zinc Sulphate", "7446-20-0", 3, 0, "", "H14O11SZn", 287.54, "", "", ""], ["Dispex AA 4040", "", 5, 0, "Dispersing inorganic pigments and fillers in water-based paints", "", 0, "", "B", ""], ["Dispex AA 4143", "", 5, 0, "", "", 0, "", "B", ""], ["Dispex CX 4320", "", 5, 0, "Pigments and fillers in gloss, semi-gloss and highly filled interior paints", "", 0, "", "B", ""], ["Dispex HIDE CX 4540", "", 5, 0, "Titanium dioxide with extenders, for more hiding", "", 0, "", "B", ""], ["Foamaster MO 2150", "", 5, 0, "Mid- to high-PVC emulsion paints, plasters, water-based adhesives", "", 0, "", "B", ""], ["Foamaster MO 2151", "", 5, 0, "", "", 0, "", "B", ""], ["Foamaster MO 2170", "", 5, 0, "", "", 0, "", "B", ""], ["FoamStar SI 2240", "", 5, 0, "Pigment concentrates and high-surfactant systems", "", 0, "", "B", ""], ["Loxanol CA 5330", "", 5, 0, "", "", 0, "", "B", ""], ["Loxanol PL 5060", "", 5, 0, "", "", 0, "", "B", ""], ["Rheovis AS 1125", "", 5, 0, "Low-shear acrylic thickener for emulsion paints", "", 0, "", "B", ""], ["Rheovis HS 1181", "", 5, 0, "Associative thickener for acrylic coatings", "", 0, "", "B", ""], ["Rheovis HS 1184", "", 5, 0, "", "", 0, "", "B", ""], ["Rheovis PE 1320", "", 5, 0, "", "", 0, "", "B", ""], ["Rheovis PE 1331", "", 5, 0, "", "", 0, "", "B", ""], ["Rheovis PU 1291", "", 5, 0, "Mid-shear polyurethane thickener for brush and roller application", "", 0, "", "B", ""], ["Rheovis UR 1120", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal 7048", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal 7051", "", 5, 0, "Texture and stone-finish paints", "", 0, "", "B", ""], ["Acronal 7079", "", 5, 0, "Elastomeric exterior wall coatings", "", 0, "", "B", ""], ["Acronal ECO 702", "", 5, 0, "Low-odour, stain-resistant premium interior paints", "", 0, "", "B", ""], ["Acronal EDGE 7005", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal EDGE 7686", "", 5, 0, "Premium exterior finishes with low dirt pick-up", "", 0, "", "B", ""], ["Acronal IA 734", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal IS 750", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal PA 510", "", 5, 0, "Low-pigmented high-gloss interior paints", "", 0, "", "B", ""], ["Acronal PA 808", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal PLUS 7023", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal PLUS 7033", "", 5, 0, "Exterior coatings", "", 0, "", "B", ""], ["Acronal PLUS 7090", "", 5, 0, "Scrub-resistant paints with high pigment-binding power", "", 0, "", "B", ""], ["Acronal PLUS 7611", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal PLUS 7648", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal PLUS 7691", "", 5, 0, "", "", 0, "", "B", ""], ["COL.9 7671", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal 295 D", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal 7035", "", 5, 0, "High-PVC all-purpose paints with good wet-scrub resistance", "", 0, "", "B", ""], ["Acronal 7092", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal 7225", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal IN 296 D", "", 5, 0, "", "", 0, "", "B", ""], ["AQACell HIDE 6299", "", 5, 0, "Hollow-sphere polymer that improves hiding and reduces titanium dioxide", "", 0, "", "B", ""], ["Acronal 7598", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal 7848", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal 7855", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal NX 3587", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal PLUS 7810", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal PS 715", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal V 275", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal Xpress 7540", "", 5, 0, "", "", 0, "", "B", ""], ["Styrofan 7809", "", 5, 0, "", "", 0, "", "B", ""], ["Styrofan NX 1492", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal 5400", "", 5, 0, "Cement-based flexible waterproofing membranes under tiles", "", 0, "", "B", ""], ["Acronal 7846", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal S 400", "", 5, 0, "", "", 0, "", "B", ""], ["Styrofan D 623", "", 5, 0, "Modifying hydraulic binders, mainly cement mixes", "", 0, "", "B", ""], ["Styrofan ID 604", "", 5, 0, "", "", 0, "", "B", ""]]};
  const CATS = CATALOG.cats;
  const P = CATALOG.rows.map((r, i) => ({
    i,
    name: r[0],
    cas: r[1],
    cat: r[2],
    co: r[3],
    app: r[4] || '',
    f: r[5] || '',
    mw: r[6] || 0,
    flag: r[7] || '',
    doc: r[8] || '',
    syn: r[9] || ''
  }));

  const HS_MAP = {
    '2915.21': ['Acetic Acid', 'Glacial acetic acid'],
    '2905.11': ['Methanol', 'Methyl alcohol'],
    '2915.39': ['Methoxypropyl Acetate', 'PGMEA'],
    '2915.31': ['Ethyl Acetate'],
    '2915.33': ['n-Butyl Acetate'],
    '2905.32': ['Propylene Glycol']
  };

  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const fml = f => f ? f.replace(/(\d+)/g, '<sub>$1</sub>') : '';

  const pickedItems = new Set();
  let toastTimeout;

  window.showToast = function(text, link = '') {
    let toast = document.getElementById('quoteToast');
    let msg = document.getElementById('toastMsg');
    let a = document.getElementById('toastLink');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-pill';
      toast.id = 'quoteToast';
      toast.innerHTML = '<span id="toastMsg"></span><a id="toastLink" href="#"></a>';
      document.body.appendChild(toast);
      msg = document.getElementById('toastMsg');
      a = document.getElementById('toastLink');
    }
    if (msg) msg.textContent = text;
    if (a) {
      if (link) {
        a.href = link;
        a.textContent = 'View Quote Form →';
        a.style.display = 'inline';
      } else {
        a.style.display = 'none';
      }
    }
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 3500);
  };

  window.addToQuote = function(prodIndex, btnElement) {
    const p = P[prodIndex];
    if (!p) return;
    pickedItems.add(prodIndex);
    if (btnElement) {
      btnElement.classList.add('added');
      btnElement.innerHTML = 'Added &#10003;';
    }

    const textarea = document.getElementById('enquiryProducts') || document.querySelector('textarea[name="message"]');
    if (textarea) {
      const line = `${p.name} (CAS ${p.cas || 'N/A'})`;
      if (!textarea.value.includes(p.name)) {
        textarea.value = textarea.value.trim() ? textarea.value.trim() + '\n• ' + line : '• ' + line;
      }
    }

    const isContactPage = window.location.pathname.endsWith('contact.html') || window.location.href.includes('contact.html');
    const quoteLink = isContactPage ? '#contactForm' : (window.location.pathname.includes('/products/') ? '../contact.html' : 'contact.html') + '?product=' + encodeURIComponent(p.name) + '&topic=Technical+data+sheet';

    window.showToast(`Added ${p.name} to quote enquiry`, quoteLink);
  };

  function searchCatalogue(query, limit = 6) {
    const q = query.trim();
    if (!q) return [];
    const n = norm(q);
    const isHs = q.toLowerCase().includes('hs') || /^\d{4}(\.\d+)?$/.test(q);

    let hsMatchedNames = [];
    if (isHs) {
      for (const [code, names] of Object.entries(HS_MAP)) {
        if (q.includes(code)) hsMatchedNames.push(...names);
      }
    }

    function score(p) {
      if (hsMatchedNames.some(name => p.name.toLowerCase().includes(name.toLowerCase()))) return 0;
      if (p.cas && norm(p.cas) === n) return 0;
      if (p.f && p.f.toLowerCase() === q.toLowerCase()) return 0;
      const nm = norm(p.name);
      const sy = norm(p.syn);
      if (nm === n) return 1;
      if (p.syn.split(' | ').some(x => norm(x) === n)) return 1;
      if (nm.startsWith(n)) return 2;
      if (nm.includes(n)) return 3;
      if (sy.includes(n)) return 4;
      if (n.length >= 3 && norm(p.app).includes(n)) return 5;
      return 9;
    }

    return P
      .map(p => ({ p, s: score(p) }))
      .filter(x => x.s < 9)
      .sort((a, b) => a.s - b.s)
      .slice(0, limit)
      .map(x => x.p);
  }

  const QS = [
    "Do you have PGMEA?",
    "Which certificates do you have?",
    "Tell me about the new silica plant",
    "Can you do contract manufacturing?",
    "What documents come with a quote?"
  ];

  const CERTS_LIST = [
    "**Quality Management (ISO 9001:2015 framework)**: Audited partner facility procedures and batch traceability",
    "**Environmental Standards (ISO 14001:2015 framework)**: Responsible solvent recovery and verified ETP compliance",
    "**Process Safety (ISO 45001:2018 framework)**: Hazchem safety across partner synthesis units",
    "**cGMP / WHO-GMP Alignment**: Pharma-grade synthesis controls with HPLC/GC analytical validation",
    "**EU REACH Dossiers**: Registration support and documentation for European exports (available upon request)"
  ];

  function md(text) {
    const lines = esc(text).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').split(/\n/);
    let h = '', inList = false;
    for (const l of lines) {
      const m = l.match(/^\s*[-•*]\s+(.*)/);
      if (m) {
        if (!inList) { h += '<ul>'; inList = true; }
        h += `<li>${m[1]}</li>`;
      } else {
        if (inList) { h += '</ul>'; inList = false; }
        if (l.trim()) h += `<p>${l}</p>`;
      }
    }
    if (inList) h += '</ul>';
    return h;
  }

  function renderProductCards(list) {
    if (!list || !list.length) return '';
    return `<div class="pc">` + list.slice(0, 3).map(p => {
      const isAdded = pickedItems.has(p.i);
      return `
        <div>
          <b>${esc(p.name)}</b>
          <span>${p.f ? fml(p.f) + ' &bull; ' : ''}${p.cas ? 'CAS ' + esc(p.cas) : esc(CATS[p.cat] || '')}</span>
          <button type="button" class="add ${isAdded ? 'added' : ''}" onclick="addToQuote(${p.i}, this)">
            ${isAdded ? 'Added &#10003;' : '+ Add to quote'}
          </button>
        </div>
      `;
    }).join('') + `</div>`;
  }

  function generateAIResponse(q) {
    const t = q.toLowerCase();

    if (/\b(sarin|soman|tabun|vx|novichok|mustard gas|ricin|tnt|rdx|hmx|petn|nitroglycerin|tatp|fentanyl|heroin|cocaine|methamphetamine|mdma|lsd|ephedrine)\b/i.test(t)) {
      return { text: "We adhere strictly to international safety conventions. We do not manufacture or supply chemical-weapon precursors, explosives, or restricted narcotics. Ask me about our specialty solvents, pharma intermediates, or industrial chemicals." };
    }

    if (/silica|silicate|new plant|expansion|upcoming/.test(t)) {
      return {
        text: "We are establishing a dedicated **silica-based chemicals plant** to expand our specialized synthesis portfolio. We specialize in high-purity silica gels, precipitated silica, and colloidal formulations.\n- Target cleanroom standards: ISO 7 / 8\n- Applications: personal care, excipients, rubber reinforcement, desiccant\nUse the contact page or quote form to receive technical updates.",
        qs: ["Can you do contract manufacturing?", "Which certificates do you have?"]
      };
    }

    if (/certif|iso|gmp|reach|who|audit|standard|quality/.test(t)) {
      return {
        text: "Our facilities and supply network are globally accredited:\n" + CERTS_LIST.join("\n") + "\nEvery shipment includes plant COA, SDS (GHS compliant), and batch traceability documentation.",
        qs: ["What documents come with a quote?", "Can you do contract manufacturing?"]
      };
    }

    if (/contract|toll|custom|synthesis|cmo|plant|capacit|facility|make/.test(t)) {
      return {
        text: "We coordinate synthesis through **parent company manufacturing infrastructure** alongside a network of **25+ audited contract manufacturing partner facilities** across India:\n- Reaction chemistries: halogenation, esterification, condensation, cryogenic reactions down to -78°C\n- Reactors: GLR, SS316, Hastelloy from 500L to 10,000L\n- Pilot to commercial scale-up with full IP protection (we sign bilateral NDAs upfront).",
        qs: ["Which certificates do you have?", "What documents come with a quote?"]
      };
    }

    if (/document|coa|tds|msds|sds|sample/.test(t)) {
      return {
        text: "Every commercial quote and shipment comes with complete documentation:\n- **Certificate of Analysis (COA)** with HPLC/GC-MS purity validation\n- **Technical Data Sheet (TDS)**\n- **Safety Data Sheet (SDS)** compliant with GHS standards\n- Commercial invoice, packing list, certificate of origin, and dangerous-goods packaging certifications where applicable.",
        qs: ["How do I get a quote?", "Do you have PGMEA?"]
      };
    }

    if (/countr|export|ship|freight|port|fob|cif|destination/.test(t)) {
      return {
        text: "We routinely export to **15+ countries** across North America, Europe, Asia Pacific, and the Middle East. We provide quotes under **FOB India, CFR, CIF, or DAP** to your port of choice. Packaging options include 200L HDPE/steel drums, 1000L IBC totes, and ISO tanks.",
        qs: ["What documents come with a quote?", "Do you have PGMEA?"]
      };
    }

    const cleanedQuery = q.replace(/\b(do|you|have|has|sell|supply|offer|need|want|price|of|for|the|a|an|is|are|available|any|i|we|can|get|me|please|about|what|tell|info|quote|sample|in|stock)\b/gi, ' ').trim();
    const matches = searchCatalogue(cleanedQuery || q, 4);
    if (matches.length) {
      return {
        text: `Yes, we have **${matches[0].name}** in our verified catalogue. Here are the specifications and matching chemical grades available for prompt dispatch:`,
        cards: matches,
        qs: ["What packaging is available?", "How do I get a quote?", "Which certificates do you have?"]
      };
    }

    return {
      text: `We supply over 270+ specialty solvents, pharma intermediates, and performance chemicals. For custom grades or specific inquiries on "${esc(q)}", we can synthesize or source it through our 25+ partner network. Contact our chemical team directly for prompt quotes.`,
      qs: ["Which certificates do you have?", "Can you do contract manufacturing?"]
    };
  }

  // DOM Injection & Attachment
  function initAskAi() {
    // 1. Inject Floating Action Button if absent
    let chatFab = document.getElementById('chatFab');
    if (!chatFab) {
      chatFab = document.createElement('button');
      chatFab.className = 'fab';
      chatFab.id = 'chatFab';
      chatFab.setAttribute('aria-label', 'Open Semzolve AI assistant');
      chatFab.innerHTML = '<span class="dot">✦</span><span class="l">Ask AI</span>';
      document.body.appendChild(chatFab);
    }

    // 2. Inject Chat Dialog if absent
    let chatModal = document.getElementById('chatModal');
    if (!chatModal) {
      chatModal = document.createElement('div');
      chatModal.className = 'chat';
      chatModal.id = 'chatModal';
      chatModal.hidden = true;
      chatModal.setAttribute('role', 'dialog');
      chatModal.setAttribute('aria-label', 'Semzolve AI Assistant');
      chatModal.innerHTML = `
        <div class="ch">
          <span class="dot">✦</span>
          <div>
            <b>Semzolve AI Specialist</b>
            <small><i></i><span>Products, certificates, manufacturing</span></small>
          </div>
          <button type="button" id="chatCloseBtn" aria-label="Close assistant">&times;</button>
        </div>
        <div class="msgs" id="chatMsgs"></div>
        <div class="qs" id="chatQuickQs"></div>
        <form class="cin" id="chatForm">
          <input id="chatInput" placeholder="Ask about a product, CAS, purity, or quote…" aria-label="Message" autocomplete="off">
          <button type="submit" id="chatSendBtn" aria-label="Send">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>
        </form>
        <div class="cfoot">Real-time chemical catalogue intelligence &middot; Direct quote generator</div>
      `;
      document.body.appendChild(chatModal);
    }

    // 3. Inject Toast if absent
    if (!document.getElementById('quoteToast')) {
      const toast = document.createElement('div');
      toast.className = 'toast-pill';
      toast.id = 'quoteToast';
      toast.innerHTML = '<span id="toastMsg"></span><a id="toastLink" href="#"></a>';
      document.body.appendChild(toast);
    }

    const chatCloseBtn = document.getElementById('chatCloseBtn');
    const chatMsgs = document.getElementById('chatMsgs');
    const chatQuickQs = document.getElementById('chatQuickQs');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');

    function openChat() {
      if (!chatModal) return;
      chatModal.hidden = false;
      if (chatFab) chatFab.hidden = true;
      if (chatMsgs && !chatMsgs.children.length) greet();
      setTimeout(() => chatInput && chatInput.focus(), 60);
    }

    function closeChat() {
      if (!chatModal) return;
      chatModal.hidden = true;
      if (chatFab) chatFab.hidden = false;
    }

    window.openChat = openChat;
    window.closeChat = closeChat;

    if (chatFab) chatFab.addEventListener('click', (e) => { e.stopPropagation(); openChat(); });
    if (chatCloseBtn) chatCloseBtn.addEventListener('click', (e) => { e.stopPropagation(); closeChat(); });

    const askAiChip = document.getElementById('askAiChip');
    if (askAiChip) askAiChip.addEventListener('click', (e) => { e.stopPropagation(); openChat(); });

    document.querySelectorAll('.mobile-nav-ai-btn, [data-open-chat]').forEach(el => {
      el.addEventListener('click', (e) => { e.stopPropagation(); openChat(); });
    });

    document.addEventListener('click', (e) => {
      if (chatModal && !chatModal.hidden) {
        const isInsideChat = chatModal.contains(e.target);
        const isOpenTrigger = e.target.closest('#chatFab') || e.target.closest('#askAiChip') || e.target.closest('.mobile-nav-ai-btn');
        if (!isInsideChat && !isOpenTrigger) closeChat();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && chatModal && !chatModal.hidden) closeChat();
    });

    function bubble(role, html) {
      const d = document.createElement('div');
      d.className = 'm ' + role;
      d.innerHTML = html;
      if (chatMsgs) {
        chatMsgs.appendChild(d);
        chatMsgs.scrollTop = chatMsgs.scrollHeight;
      }
      return d;
    }

    function renderQuickQs(list) {
      if (!chatQuickQs) return;
      chatQuickQs.innerHTML = list.map(q => `<button type="button">${esc(q)}</button>`).join('');
    }

    if (chatQuickQs) {
      chatQuickQs.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (btn) sendChat(btn.textContent);
      });
    }

    function greet() {
      bubble('a', md("Hi, I'm the **Semzolve AI Specialist**. Ask me about any chemical in our catalogue, our **certifications**, **manufacturing plants**, or request a quote for export shipments."));
      renderQuickQs(QS);
    }

    function sendChat(text) {
      const msg = String(text || '').trim();
      if (!msg) return;
      if (chatModal && chatModal.hidden) openChat();
      if (chatQuickQs) chatQuickQs.innerHTML = '';
      bubble('u', esc(msg));
      if (chatInput) chatInput.value = '';

      const botBubble = bubble('a', '<span style="color:#55657F; font-size:13px;">Reviewing catalogue specifications...</span>');

      setTimeout(() => {
        const resp = generateAIResponse(msg);
        botBubble.innerHTML = md(resp.text) + renderProductCards(resp.cards || []);
        if (chatMsgs) chatMsgs.scrollTop = chatMsgs.scrollHeight;
        renderQuickQs(resp.qs || QS.slice(0, 3));
      }, 300);
    }

    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (chatInput) sendChat(chatInput.value);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAskAi);
  } else {
    initAskAi();
  }
})();
