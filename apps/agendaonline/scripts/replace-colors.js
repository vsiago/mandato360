import fs from 'fs';

const filePath = 'c:\\Users\\iago-note\\Documents\\monorepo\\apps\\agendaonline\\components\\scheduling-section.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace specific background, border, and text colors related to active states
content = content.replace(/'bg-\[#0B1426\] text-white border-\[#0B1426\]'/g, "'bg-[var(--tenant-primary)] text-white border-[var(--tenant-primary)]'");

content = content.replace(/bg-\[#0B1426\] text-white px-8 h-\[50px\]/g, "bg-[var(--tenant-primary)] text-white px-8 h-[50px]");
content = content.replace(/bg-\[#0B1426\] text-white px-8 py-4/g, "bg-[var(--tenant-primary)] text-white px-8 py-4");
content = content.replace(/bg-\[#0B1426\] text-white px-6/g, "bg-[var(--tenant-primary)] text-white px-6");

// Remove colored shadow for continue buttons
content = content.replace(/shadow-\[#0B1426\]\/20/g, "");
content = content.replace(/hover:shadow-\[#0B1426\]\/30/g, "");

content = content.replace(/'bg-\[#0B1426\] text-white shadow-md'/g, "'bg-[var(--tenant-primary)] text-white shadow-md'");
content = content.replace(/hover:text-\[#0B1426\]/g, "hover:text-[var(--tenant-primary)]");
content = content.replace(/hover:border-\[#0B1426\]/g, "hover:border-[var(--tenant-primary)]");

content = content.replace(/'bg-\[#0B1426\] border-\[#0B1426\] text-white shadow-md'/g, "'bg-[var(--tenant-primary)] border-[var(--tenant-primary)] text-white shadow-md'");
content = content.replace(/"bg-\[#0B1426\] border-\[#0B1426\] text-white shadow-lg"/g, "\"bg-[var(--tenant-primary)] border-[var(--tenant-primary)] text-white shadow-lg\"");

content = content.replace(/focus-within:border-\[#0B1426\]/g, "focus-within:border-[var(--tenant-primary)]");
content = content.replace(/focus-within:ring-\[#0B1426\]\/10/g, "focus-within:ring-[var(--tenant-primary)]/10");
content = content.replace(/group-focus-within:text-\[#0B1426\]/g, "group-focus-within:text-[var(--tenant-primary)]");

fs.writeFileSync(filePath, content);
console.log("Done replacing colors!");
