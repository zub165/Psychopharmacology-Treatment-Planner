// Distribution Functions

// Weight-Based Dosing Calculator
window.calculateWeightBasedDose = function() {
    const weight = parseFloat(document.getElementById('patientWeight').value);
    const medication = document.getElementById('medicationSelect').value;
    const resultDiv = document.getElementById('weightBasedResult');
    
    if (!weight || !medication) {
        showResult(resultDiv, 'Please enter weight and select medication', 'warning');
        return;
    }

    const dosing = {
        fluoxetine: {
            minDose: 0.5,
            maxDose: 0.8,
            unit: 'mg/kg/day'
        },
        sertraline: {
            minDose: 0.5,
            maxDose: 1.5,
            unit: 'mg/kg/day'
        },
        venlafaxine: {
            minDose: 1,
            maxDose: 2,
            unit: 'mg/kg/day'
        },
        bupropion: {
            minDose: 2,
            maxDose: 3,
            unit: 'mg/kg/day'
        }
    };

    const med = dosing[medication];
    const minTotal = Math.round(weight * med.minDose);
    const maxTotal = Math.round(weight * med.maxDose);
    
    showResult(resultDiv, `
        <h4>Weight-Based Dosing Results:</h4>
        <p>Recommended daily dose range: ${minTotal}-${maxTotal} mg/day</p>
        <p>Based on ${med.minDose}-${med.maxDose} ${med.unit}</p>
        <p class="note">Note: Adjust based on clinical response and tolerability</p>
    `);
}

// Renal Function Dose Adjustment
window.calculateRenalAdjustedDose = function() {
    const crCl = parseFloat(document.getElementById('creatinineClearance').value);
    const medication = document.getElementById('renalMedSelect').value;
    const resultDiv = document.getElementById('renalAdjustmentResult');
    
    if (!crCl || !medication) {
        showResult(resultDiv, 'Please enter creatinine clearance and select medication', 'warning');
        return;
    }

    const adjustments = {
        lithium: function(crCl) {
            if (crCl > 60) return 'Normal dosing (600-1200 mg/day)';
            if (crCl > 30) return 'Reduce dose by 50%, monitor levels closely';
            return 'Avoid use or consult specialist';
        },
        gabapentin: function(crCl) {
            if (crCl > 60) return 'Normal dosing (900-3600 mg/day)';
            if (crCl > 30) return 'Reduce dose to 600-1800 mg/day';
            if (crCl > 15) return 'Reduce dose to 300-900 mg/day';
            return 'Reduce dose to 150-600 mg/day';
        },
        pregabalin: function(crCl) {
            if (crCl > 60) return 'Normal dosing (300-600 mg/day)';
            if (crCl > 30) return 'Reduce dose to 150-300 mg/day';
            if (crCl > 15) return 'Reduce dose to 75-150 mg/day';
            return 'Reduce dose to 25-75 mg/day';
        }
    };

    const recommendation = adjustments[medication](crCl);
    showResult(resultDiv, `
        <h4>Renal Dose Adjustment:</h4>
        <p>For CrCl of ${crCl} mL/min:</p>
        <p>${recommendation}</p>
        <p class="note">Monitor renal function regularly and adjust as needed</p>
    `);
}

// Drug Level Monitoring
window.evaluateDrugLevel = function() {
    const level = parseFloat(document.getElementById('drugLevel').value);
    const medication = document.getElementById('monitoringMedSelect').value;
    const resultDiv = document.getElementById('drugLevelResult');
    
    if (!level || !medication) {
        showResult(resultDiv, 'Please enter drug level and select medication', 'warning');
        return;
    }

    const ranges = {
        lithium: {
            min: 0.6,
            max: 1.2,
            unit: 'mEq/L',
            toxic: 1.5
        },
        valproate: {
            min: 50,
            max: 100,
            unit: 'mcg/mL',
            toxic: 120
        },
        carbamazepine: {
            min: 4,
            max: 12,
            unit: 'mcg/mL',
            toxic: 15
        },
        clozapine: {
            min: 350,
            max: 600,
            unit: 'ng/mL',
            toxic: 1000
        }
    };

    const range = ranges[medication];
    let status = 'therapeutic';
    if (level < range.min) status = 'subtherapeutic';
    if (level > range.max) status = 'supratherapeutic';
    if (level > range.toxic) status = 'potentially toxic';

    const statusClass = {
        therapeutic: '',
        subtherapeutic: 'warning',
        supratherapeutic: 'warning',
        'potentially toxic': 'warning'
    };

    showResult(resultDiv, `
        <h4>Drug Level Evaluation:</h4>
        <p>Current level: ${level} ${range.unit}</p>
        <p>Therapeutic range: ${range.min}-${range.max} ${range.unit}</p>
        <p>Status: <strong>${status.toUpperCase()}</strong></p>
        ${status === 'potentially toxic' ? '<p class="warning">URGENT: Consider toxicity management</p>' : ''}
    `, statusClass[status]);
}

// Drug Interaction Checker
window.checkInteractions = function() {
    const selectedMeds = Array.from(document.querySelectorAll('#interactionMedList input:checked'))
        .map(input => input.value);
    const resultDiv = document.getElementById('interactionResult');
    
    if (selectedMeds.length < 2) {
        showResult(resultDiv, 'Please select at least two medications to check interactions', 'warning');
        return;
    }

    const interactions = {
        fluoxetine: {
            lithium: 'Monitor for serotonin syndrome',
            clozapine: 'May increase clozapine levels',
            carbamazepine: 'May alter metabolism'
        },
        lithium: {
            fluoxetine: 'Monitor for serotonin syndrome',
            valproate: 'May alter lithium levels',
            carbamazepine: 'Monitor lithium levels'
        },
        clozapine: {
            fluoxetine: 'May increase clozapine levels',
            valproate: 'Monitor for additive effects',
            carbamazepine: 'May decrease clozapine levels'
        },
        valproate: {
            lithium: 'May alter lithium levels',
            clozapine: 'Monitor for additive effects',
            carbamazepine: 'Complex interaction, monitor levels'
        },
        carbamazepine: {
            fluoxetine: 'May alter metabolism',
            lithium: 'Monitor lithium levels',
            clozapine: 'May decrease clozapine levels',
            valproate: 'Complex interaction, monitor levels'
        }
    };

    let interactionFound = false;
    let interactionText = '<h4>Drug Interaction Results:</h4><ul>';
    
    for (let i = 0; i < selectedMeds.length; i++) {
        for (let j = i + 1; j < selectedMeds.length; j++) {
            const med1 = selectedMeds[i];
            const med2 = selectedMeds[j];
            if (interactions[med1]?.[med2]) {
                interactionFound = true;
                interactionText += `<li><strong>${med1} + ${med2}:</strong> ${interactions[med1][med2]}</li>`;
            }
        }
    }
    
    interactionText += '</ul>';
    if (!interactionFound) {
        interactionText += '<p>No significant interactions found between selected medications.</p>';
    } else {
        interactionText += '<p class="note">Monitor patients closely when using these combinations.</p>';
    }
    
    showResult(resultDiv, interactionText, interactionFound ? 'warning' : '');
}

// Clinical Decision Support
window.getClinicalGuidance = function() {
    const scenario = document.getElementById('clinicalScenario').value;
    const resultDiv = document.getElementById('clinicalGuidanceResult');
    
    if (!scenario) {
        showResult(resultDiv, 'Please select a clinical scenario', 'warning');
        return;
    }

    const guidance = {
        elderly: `
            <h4>Guidance for Elderly Patients (>65 years):</h4>
            <ul>
                <li>Start at lower doses (usually 1/2 adult starting dose)</li>
                <li>Titrate more slowly ("Start low, go slow")</li>
                <li>Monitor for falls, cognitive effects, and anticholinergic burden</li>
                <li>Check for drug interactions with existing medications</li>
                <li>Regular monitoring of renal function</li>
            </ul>
        `,
        pregnancy: `
            <h4>Guidance for Pregnancy:</h4>
            <ul>
                <li>Consider risk/benefit ratio carefully</li>
                <li>SSRIs generally considered safer (except paroxetine)</li>
                <li>Avoid valproate due to teratogenicity</li>
                <li>Monitor for PPHN risk with late-pregnancy SSRI use</li>
                <li>Consider non-pharmacological interventions</li>
            </ul>
        `,
        hepatic: `
            <h4>Guidance for Hepatic Impairment:</h4>
            <ul>
                <li>Reduce doses of highly liver-metabolized medications</li>
                <li>Monitor LFTs regularly</li>
                <li>Avoid medications with known hepatotoxicity</li>
                <li>Consider medications with renal clearance</li>
                <li>Regular monitoring of drug levels when applicable</li>
            </ul>
        `,
        bleeding: `
            <h4>Guidance for Bleeding Risk:</h4>
            <ul>
                <li>Use caution with SSRIs/SNRIs</li>
                <li>Monitor for signs of bleeding</li>
                <li>Consider risk with concurrent anticoagulants</li>
                <li>Regular CBC monitoring</li>
                <li>Consider medications with lower bleeding risk</li>
            </ul>
        `
    };

    showResult(resultDiv, guidance[scenario], 'info');
}

// Helper function to show results
function showResult(element, html, type = '') {
    element.innerHTML = html;
    element.className = `result-box show ${type ? type + '-box' : ''}`;
}

const medications = [
    // SSRIs
    {
        name: "Fluoxetine",
        class: "SSRI",
        brand: "Prozac",
        indications: ["Depression", "OCD", "Panic Disorder", "Bulimia Nervosa"],
        receptors: [
            { name: "SERT", affinity: "high" },
            { name: "5-HT2C", affinity: "moderate" }
        ],
        dosing: {
            depression: { start: "20mg", max: "80mg" }
        }
    },
    {
        name: "Sertraline",
        class: "SSRI",
        brand: "Zoloft",
        indications: ["Depression", "OCD", "Panic Disorder", "PTSD"],
        receptors: [{ name: "SERT", affinity: "high" }],
        dosing: {
            depression: { start: "50mg", max: "200mg" }
        }
    },
    {
        name: "Paroxetine",
        class: "SSRI",
        brand: "Paxil",
        indications: ["Depression", "Anxiety", "OCD", "PTSD"],
        receptors: [{ name: "SERT", affinity: "high" }],
        dosing: {
            depression: { start: "20mg", max: "50mg" }
        }
    },
    {
        name: "Citalopram",
        class: "SSRI",
        brand: "Celexa",
        indications: ["Depression"],
        receptors: [{ name: "SERT", affinity: "high" }],
        dosing: {
            depression: { start: "20mg", max: "40mg" }
        }
    },
    {
        name: "Escitalopram",
        class: "SSRI",
        brand: "Lexapro",
        indications: ["Depression", "Anxiety"],
        receptors: [{ name: "SERT", affinity: "high" }],
        dosing: {
            depression: { start: "10mg", max: "20mg" }
        }
    },
    {
        name: "Fluvoxamine",
        class: "SSRI",
        brand: "Luvox",
        indications: ["OCD", "Social Anxiety"],
        receptors: [{ name: "SERT", affinity: "high" }],
        dosing: {
            ocd: { start: "50mg", max: "300mg" }
        }
    },
    
    // SNRIs
    {
        name: "Venlafaxine",
        class: "SNRI",
        brand: "Effexor",
        indications: ["Depression", "Anxiety", "Panic Disorder"],
        receptors: [
            { name: "SERT", affinity: "high" },
            { name: "NET", affinity: "moderate" }
        ],
        dosing: {
            depression: { start: "37.5mg", max: "375mg" }
        }
    },
    {
        name: "Desvenlafaxine",
        class: "SNRI",
        brand: "Pristiq",
        indications: ["Depression"],
        receptors: [
            { name: "SERT", affinity: "high" },
            { name: "NET", affinity: "moderate" }
        ],
        dosing: {
            depression: { start: "50mg", max: "100mg" }
        }
    },
    {
        name: "Duloxetine",
        class: "SNRI",
        brand: "Cymbalta",
        indications: ["Depression", "Anxiety", "Neuropathic Pain"],
        receptors: [
            { name: "SERT", affinity: "high" },
            { name: "NET", affinity: "high" }
        ],
        dosing: {
            depression: { start: "30mg", max: "120mg" }
        }
    },
    
    // Atypical Antidepressants
    {
        name: "Bupropion",
        class: "Atypical Antidepressant",
        brand: "Wellbutrin, Aplenzin, Auvelity",
        indications: ["Depression", "Smoking Cessation"],
        receptors: [
            { name: "DAT", affinity: "moderate" },
            { name: "NET", affinity: "moderate" }
        ],
        dosing: {
            depression: { start: "150mg", max: "450mg" }
        }
    },
    {
        name: "Mirtazapine",
        class: "Atypical Antidepressant",
        brand: "Remeron",
        indications: ["Depression"],
        receptors: [
            { name: "5-HT2A", affinity: "antagonist" },
            { name: "H1", affinity: "high" }
        ],
        dosing: {
            depression: { start: "15mg", max: "45mg" }
        }
    },
    {
        name: "Nefazodone",
        class: "Atypical Antidepressant",
        brand: "Serzone",
        indications: ["Depression"],
        receptors: [
            { name: "5-HT2A", affinity: "antagonist" },
            { name: "SERT", affinity: "moderate" }
        ],
        dosing: {
            depression: { start: "100mg", max: "600mg" }
        }
    },
    {
        name: "Trazodone",
        class: "Atypical Antidepressant",
        brand: "Desyrel",
        indications: ["Depression", "Insomnia"],
        receptors: [
            { name: "5-HT2A", affinity: "antagonist" },
            { name: "H1", affinity: "moderate" }
        ],
        dosing: {
            depression: { start: "50mg", max: "400mg" }
        }
    },
    {
        name: "Vilazodone",
        class: "Atypical Antidepressant",
        brand: "Viibryd",
        indications: ["Depression"],
        receptors: [
            { name: "SERT", affinity: "high" },
            { name: "5-HT1A", affinity: "partial agonist" }
        ],
        dosing: {
            depression: { start: "10mg", max: "40mg" }
        }
    },
    {
        name: "Vortioxetine",
        class: "Atypical Antidepressant",
        brand: "Trintellix",
        indications: ["Depression"],
        receptors: [
            { name: "SERT", affinity: "high" },
            { name: "5-HT1A", affinity: "agonist" }
        ],
        dosing: {
            depression: { start: "10mg", max: "20mg" }
        }
    },
    {
        name: "Esketamine",
        class: "Atypical Antidepressant",
        brand: "Spravato",
        indications: ["Treatment-Resistant Depression"],
        receptors: [
            { name: "NMDA", affinity: "antagonist" }
        ],
        dosing: {
            depression: { start: "56mg", max: "84mg" }
        }
    },
    
    // MAOIs
    {
        name: "Isocarboxazid",
        class: "MAOI",
        brand: "Marplan",
        indications: ["Depression"],
        receptors: [{ name: "MAO", affinity: "irreversible inhibitor" }],
        dosing: {
            depression: { start: "10mg", max: "60mg" }
        }
    },
    {
        name: "Phenelzine",
        class: "MAOI",
        brand: "Nardil",
        indications: ["Depression", "Anxiety"],
        receptors: [{ name: "MAO", affinity: "irreversible inhibitor" }],
        dosing: {
            depression: { start: "15mg", max: "90mg" }
        }
    },
    {
        name: "Selegiline",
        class: "MAOI",
        brand: "Emsam",
        indications: ["Depression"],
        receptors: [{ name: "MAO-B", affinity: "selective inhibitor" }],
        dosing: {
            depression: { start: "6mg", max: "12mg" }
        }
    },
    {
        name: "Tranylcypromine",
        class: "MAOI",
        brand: "Parnate",
        indications: ["Depression"],
        receptors: [{ name: "MAO", affinity: "irreversible inhibitor" }],
        dosing: {
            depression: { start: "10mg", max: "60mg" }
        }
    },
    
    // Tricyclics
    {
        name: "Nortriptyline",
        class: "Tricyclic",
        brand: "Pamelor",
        indications: ["Depression", "Neuropathic Pain"],
        receptors: [
            { name: "NET", affinity: "high" },
            { name: "SERT", affinity: "moderate" }
        ],
        dosing: {
            depression: { start: "25mg", max: "150mg" }
        }
    },
    {
        name: "Amitriptyline",
        class: "Tricyclic",
        brand: "Elavil",
        indications: ["Depression", "Neuropathic Pain", "Migraine"],
        receptors: [
            { name: "SERT", affinity: "high" },
            { name: "NET", affinity: "high" }
        ],
        dosing: {
            depression: { start: "25mg", max: "300mg" }
        }
    },
    {
        name: "Doxepin",
        class: "Tricyclic",
        brand: "Silenor",
        indications: ["Depression", "Anxiety", "Insomnia"],
        receptors: [
            { name: "SERT", affinity: "moderate" },
            { name: "NET", affinity: "moderate" },
            { name: "H1", affinity: "high" }
        ],
        dosing: {
            depression: { start: "25mg", max: "300mg" }
        }
    }
]; 