// --- 1. Linked List Structures and Logic ---

class Node {
    constructor(coefficient, exponent) {
        this.coefficient = coefficient;
        this.exponent = exponent;
        this.next = null;
    }
}

class Polynomial {
    constructor() {
        this.head = null;
    }

    insertTerm(coefficient, exponent) {
        if (coefficient === 0) return;
        const newNode = new Node(coefficient, exponent);

        if (!this.head || newNode.exponent > this.head.exponent) {
            newNode.next = this.head;
            this.head = newNode;
            return;
        }

        let current = this.head;
        let prev = null;
        
        while (current && current.exponent > exponent) {
            prev = current;
            current = current.next;
        }

        if(prev) {
            newNode.next = current;
            prev.next = newNode;
        } else {
             newNode.next = this.head;
             this.head = newNode;
        }
    }

    /**
     * Helper: Formats the polynomial for display (e.g., 5x² + 3x - 1)
     */
    toString() {
        let result = "";
        let current = this.head;

        if (!current) return "0";

        while (current) {
            const coeff = current.coefficient;
            const exp = current.exponent;
            let term = "";

            if (coeff === 0) {
                current = current.next;
                continue;
            }

            // Handle sign and spacing
            if (coeff > 0 && result !== "") {
                term += " + ";
            } else if (coeff < 0) {
                term += " - ";
            }

            const absCoeff = Math.abs(coeff);

            // Handle coefficient printing (don't print 1 for exponents > 0)
            if (exp === 0 || absCoeff !== 1) {
                term += absCoeff;
            } else if (absCoeff === 1 && exp === 0) {
                term += "1";
            }

            // Handle variable (x) and exponent printing
            if (exp > 0) {
                term += "x";
            }
            if (exp > 1) {
                term += "<sup>" + exp + "</sup>"; // Using <sup> for superscript (x^2)
            }

            result += term;
            current = current.next;
        }
        return result.trim() === "" ? "0" : result.trim();
    }
}

function addPolynomials(polyA, polyB) {
    const termsMap = new Map();
    const collectTerms = (poly) => {
        let current = poly.head;
        while (current) {
            termsMap.set(current.exponent, (termsMap.get(current.exponent) || 0) + current.coefficient);
            current = current.next;
        }
    };

    collectTerms(polyA);
    collectTerms(polyB);

    const resultPoly = new Polynomial();
    for (const [exp, coeff] of termsMap) {
        if (coeff !== 0) {
            resultPoly.insertTerm(coeff, exp);
        }
    }
    return resultPoly;
}

function multiplyPolynomials(polyA, polyB) {
    const termsMap = new Map();

    let currentA = polyA.head;
    while (currentA) {
        let currentB = polyB.head;
        while (currentB) {
            const newCoeff = currentA.coefficient * currentB.coefficient;
            const newExp = currentA.exponent + currentB.exponent;

            termsMap.set(newExp, (termsMap.get(newExp) || 0) + newCoeff);
            currentB = currentB.next;
        }
        currentA = currentA.next;
    }

    const resultPoly = new Polynomial();
    for (const [exp, coeff] of termsMap) {
        if (coeff !== 0) {
            resultPoly.insertTerm(coeff, exp);
        }
    }
    return resultPoly;
}


// --- 2. Dynamic UI Handlers ---

// Function to create and append a new term row
function addTerm(polyId) {
    const container = document.getElementById(`poly${polyId}-terms`);
    const row = document.createElement('div');
    row.className = 'term-row';
    row.innerHTML = `
        <input type="number" class="coeff" placeholder="Coeff" value="">
        <input type="number" class="exp" placeholder="Exp" value="">
        <button class="remove-term-btn" onclick="this.parentElement.remove()">&#x2715;</button>
    `;
    container.appendChild(row);
    // Automatically update the display when a term is added/removed
    updatePolyDisplay(); 
}

// Function to extract terms from the rows and build the Linked List
function parsePolynomialFromDOM(polyId) {
    const poly = new Polynomial();
    const container = document.getElementById(`poly${polyId}-terms`);
    const rows = container.getElementsByClassName('term-row');

    for (const row of rows) {
        const coeffInput = row.querySelector('.coeff');
        const expInput = row.querySelector('.exp');

        const coeff = parseFloat(coeffInput.value || 0);
        const exp = parseFloat(expInput.value || 0);

        if (!isNaN(coeff) && !isNaN(exp)) {
            poly.insertTerm(coeff, exp);
        }
    }
    return poly;
}

// NEW FUNCTION: Updates the bottom two display cards
function updatePolyDisplay() {
    const polyA = parsePolynomialFromDOM(1);
    const polyB = parsePolynomialFromDOM(2);

    document.getElementById('poly1-display').innerHTML = polyA.toString();
    document.getElementById('poly2-display').innerHTML = polyB.toString();
}

// Initial setup and event listeners for real-time display update
document.addEventListener('DOMContentLoaded', () => {
    addTerm(1); 
    addTerm(2); 

    // Add listeners to input fields to update the display area as user types
    document.addEventListener('input', (event) => {
        if (event.target.classList.contains('coeff') || event.target.classList.contains('exp')) {
            updatePolyDisplay();
        }
    });

    // Use a MutationObserver to watch for row removals and update display
    const observerCallback = (mutationsList, observer) => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                updatePolyDisplay();
            }
        }
    };
    const config = { childList: true, subtree: true };
    
    // Watch both polynomial containers for changes
    new MutationObserver(observerCallback).observe(document.getElementById('poly1-terms'), config);
    new MutationObserver(observerCallback).observe(document.getElementById('poly2-terms'), config);
});


// --- 3. Main Calculation Function ---
function calculate(operation) {
    // Ensure display is up to date
    updatePolyDisplay(); 
    
    const polyA = parsePolynomialFromDOM(1);
    const polyB = parsePolynomialFromDOM(2);

    let resultPoly;

    if (operation === 'add') {
        resultPoly = addPolynomials(polyA, polyB);
    } else if (operation === 'multiply') {
        resultPoly = multiplyPolynomials(polyA, polyB);
    }

    // Show the final calculated polynomial expression
    document.getElementById('result-poly').innerHTML = resultPoly.toString();
}