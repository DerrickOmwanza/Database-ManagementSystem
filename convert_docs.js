const officegen = require('officegen');
const fs = require('fs');
const path = require('path');

function convertMdToDocx(mdFilePath, docxFilePath, title) {
    const docx = officegen('docx');
    
    // Set Document Properties
    docx.setDocTitle(title);
    docx.setDocSubject('KCSE 2026 Computer Studies Project');
    docx.setDocKeywords('ISP, Database, Management, System');
    
    const content = fs.readFileSync(mdFilePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach(line => {
        let pObj;
        
        // Headings (H1, H2, H3)
        if (line.startsWith('# ')) {
            pObj = docx.createP();
            pObj.addText(line.substring(2).toUpperCase(), { bold: true, font_size: 16, underline: true });
            pObj.options.align = 'center';
        } else if (line.startsWith('## ')) {
            pObj = docx.createP();
            pObj.addText(line.substring(3), { bold: true, font_size: 14, underline: true });
        } else if (line.startsWith('### ')) {
            pObj = docx.createP();
            pObj.addText(line.substring(4), { bold: true, font_size: 12, underline: true });
        } else if (line.trim() === '') {
            // Skip empty lines
        } else {
            // Normal text
            pObj = docx.createP();
            // Basic handling for bold/italic in MD
            let cleanLine = line.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
            pObj.addText(cleanLine, { font_size: 11 });
        }
    });

    const out = fs.createWriteStream(docxFilePath);
    out.on('error', (err) => {
        console.log(err);
    });

    docx.generate(out);
    console.log(`Successfully generated: ${docxFilePath}`);
}

// Convert all essential documents
const docsToConvert = [
    { md: 'docs/SRS/SRS.md', docx: 'docs/Word/SRS.docx', title: 'Software Requirements Specification' },
    { md: 'docs/Design/SystemDesign.md', docx: 'docs/Word/SystemDesign.docx', title: 'System Design Document' },
    { md: 'docs/ProjectPlan.md', docx: 'docs/Word/ProjectPlan.docx', title: 'Project Plan' },
    { md: 'README.md', docx: 'docs/Word/README.docx', title: 'Project Overview' }
];

docsToConvert.forEach(doc => {
    const fullMdPath = path.join(__dirname, doc.md);
    const fullDocxPath = path.join(__dirname, doc.docx);
    if (fs.existsSync(fullMdPath)) {
        convertMdToDocx(fullMdPath, fullDocxPath, doc.title);
    }
});
