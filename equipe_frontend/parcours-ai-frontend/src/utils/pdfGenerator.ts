import { jsPDF } from 'jspdf';
import { Career, UserProfile } from '../types';

export interface GenerateRoadmapPdfOptions {
  career: Career;
  userProfile?: UserProfile;
  candidateName?: string;
  roadmapPhases?: Array<{
    step: number;
    title: string;
    duration: string;
    description: string;
    skills: string[];
    milestone?: string;
  }>;
}

export async function generateCareerRoadmapPDF(options: GenerateRoadmapPdfOptions): Promise<void> {
  const { career, userProfile, candidateName, roadmapPhases } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  const primaryColor: [number, number, number] = [14, 116, 144]; // Cyan 700 (#0e7490)
  const secondaryColor: [number, number, number] = [37, 99, 235]; // Blue 600 (#2563eb)
  const darkNavy: [number, number, number] = [15, 23, 42]; // Slate 900 (#0f172a)
  const textMuted: [number, number, number] = [100, 116, 139]; // Slate 500
  const lightBg: [number, number, number] = [248, 250, 252]; // Slate 50

  let currentY = margin;

  // ==========================================
  // EN-TÊTE / HEADER OFFICIEL
  // ==========================================
  
  // Bandeau dégradé haut de page
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 6, 'F');

  currentY = 16;

  // Logo & Titre de marque
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...darkNavy);
  doc.text('PARCOURS AI', margin, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...textMuted);
  doc.text("Orientation & Feuilles de Route Numériques d'Excellence", margin, currentY + 5);

  // Badge du rapport à droite
  const reportDate = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(pageWidth - margin - 60, currentY - 4, 60, 14, 2, 2, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...primaryColor);
  doc.text('DOSSIER STRATÉGIQUE', pageWidth - margin - 56, currentY + 1);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...textMuted);
  doc.text(`Émis le ${reportDate}`, pageWidth - margin - 56, currentY + 6);

  currentY += 18;

  // Ligne de séparation fine
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  currentY += 8;

  // ==========================================
  // CADRE PRINCIPAL DU MÉTIER CIBLE
  // ==========================================
  doc.setFillColor(...lightBg);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, currentY, contentWidth, 34, 3, 3, 'FD');

  // Barre accent gauche
  doc.setFillColor(...secondaryColor);
  doc.roundedRect(margin, currentY, 3, 34, 1.5, 1.5, 'F');

  // Titre du métier
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...darkNavy);
  doc.text(career.title, margin + 8, currentY + 9);

  // Badge de concordance / Match Score
  const matchText = `Indice de Concordance : ${career.matchScore || 95}%`;
  doc.setFontSize(8.5);
  doc.setTextColor(...primaryColor);
  doc.text(matchText, margin + 8, currentY + 16);

  // Candidat & Profil
  const candName = candidateName || userProfile?.name || 'Candidat Parcours AI';
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...textMuted);
  doc.text(`Bénéficiaire : ${candName}`, margin + 8, currentY + 23);
  doc.text(`Objectif : ${userProfile?.targetGoals || 'Insertion professionnelle & Télétravail international'}`, margin + 8, currentY + 28);

  currentY += 40;

  // ==========================================
  // SECTION SALAIRES & MARCHÉ DE L'EMPLOI
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...darkNavy);
  doc.text("1. Perspectives du Marché & Grilles Salariales", margin, currentY);
  currentY += 5;

  const colWidth = (contentWidth - 6) / 2;

  // Boîte Marché Local
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, colWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 118, 110); // Teal 700
  doc.text("Marché Local (Bénin & UEMOA)", margin + 5, currentY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...darkNavy);
  doc.text(career.salaryLocal || "500.000 à 1.200.000 FCFA/mois", margin + 5, currentY + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...textMuted);
  doc.text(`Demande : ${career.marketDemand || 'Très élevée'} (${career.demandLocation || 'Cotonou & Région'})`, margin + 5, currentY + 18);

  // Boîte Télétravail International (Remote)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin + colWidth + 6, currentY, colWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...secondaryColor);
  doc.text("Télétravail International (Remote UE/USA)", margin + colWidth + 11, currentY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...darkNavy);
  doc.text(career.salaryRemote || "40.000€ à 85.000€/an", margin + colWidth + 11, currentY + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...textMuted);
  doc.text("Paiements en devises (EUR / USD) & Contrats B2B", margin + colWidth + 11, currentY + 18);

  currentY += 28;

  // ==========================================
  // SECTION COMPÉTENCES CLÉS & OUTILS
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...darkNavy);
  doc.text("2. Compétences Clés & Technologies Prioritaires", margin, currentY);
  currentY += 5;

  const skillsText = (career.keySkills || []).join('  •  ');
  const toolsText = (career.tools || []).join('  •  ');

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 20, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...primaryColor);
  doc.text("Compétences prioritaires :", margin + 5, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...darkNavy);
  doc.text(doc.splitTextToSize(skillsText || 'Développement, Conception logicielle, Git, Anglais technique', contentWidth - 10), margin + 5, currentY + 11);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...secondaryColor);
  doc.text("Stack & Outils de production :", margin + 5, currentY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...darkNavy);
  doc.text(toolsText || 'VS Code, GitHub, Docker, Figma, Linux', margin + 52, currentY + 16);

  currentY += 27;

  // ==========================================
  // SECTION FEUILLE DE ROUTE D'APPRENTISSAGE (4 PHASES)
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...darkNavy);
  doc.text("3. Plan d'Action & Feuille de Route d'Apprentissage", margin, currentY);
  currentY += 6;

  const defaultPhases = [
    {
      step: 1,
      title: "Phase 1 : Fondations et Concepts Théoriques",
      duration: "Mois 1 - 2",
      description: "Acquisition des bases algorithmiques, principes d'architecture et environnement technique.",
      skills: ["Bases fondamentales", "Pratique quotidienne", "Outils de versioning (Git)"],
      milestone: "Premier projet structuré fonctionnel"
    },
    {
      step: 2,
      title: "Phase 2 : Outils de Production & Frameworks Modernes",
      duration: "Mois 3 - 4",
      description: "Maîtrise des bibliothèques et standards de l'industrie pour concevoir des systèmes modulaires.",
      skills: ["Frameworks avancés", "APIs & Données", "Bonnes pratiques de sécurité"],
      milestone: "Application complète déployée en ligne"
    },
    {
      step: 3,
      title: "Phase 3 : Réalisation de Projets Porteurs & Portfolio",
      duration: "Mois 5 - 6",
      description: "Conception de 2 à 3 projets complets documentés sur GitHub et testables publiquement.",
      skills: ["Tests automatisés", "Performance", "Documentation README claire"],
      milestone: "Portfolio professionnel vérifiable"
    },
    {
      step: 4,
      title: "Phase 4 : Certifications, Réseau & Candidatures Internationales",
      duration: "Mois 7+",
      description: "Préparation des entretiens techniques, optimisation du profil LinkedIn et prospection ciblée.",
      skills: ["Anglais technique", "Simulations d'entretiens", "Négociation salariale"],
      milestone: "Premier contrat ou prise de poste validée"
    }
  ];

  const phasesToRender = roadmapPhases && roadmapPhases.length > 0 ? roadmapPhases : defaultPhases;

  phasesToRender.forEach((phase, index) => {
    // Vérifier si un saut de page est nécessaire
    if (currentY > pageHeight - 35) {
      doc.addPage();
      currentY = margin;

      // Bandeau haut sur page suivante
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, pageWidth, 4, 'F');
      currentY = 12;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...textMuted);
      doc.text(`PARCOURS AI — Feuille de Route : ${career.title} (Suite)`, margin, currentY);
      currentY += 8;
    }

    // Boîte de la phase
    const phaseBoxHeight = 21;
    doc.setFillColor(index % 2 === 0 ? 255 : 248, index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 255 : 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, currentY, contentWidth, phaseBoxHeight, 2, 2, 'FD');

    // Pastille de numéro
    doc.setFillColor(...primaryColor);
    doc.circle(margin + 6, currentY + 6, 3.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(String(phase.step), margin + 4.8, currentY + 7.2);

    // Titre et Durée
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...darkNavy);
    doc.text(phase.title, margin + 13, currentY + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...secondaryColor);
    doc.text(phase.duration, pageWidth - margin - 26, currentY + 7);

    // Description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(doc.splitTextToSize(phase.description, contentWidth - 18), margin + 13, currentY + 12);

    // Milestone / Jalons
    if (phase.milestone) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(15, 118, 110);
      doc.text(`Jalon : ${phase.milestone}`, margin + 13, currentY + 18);
    }

    currentY += phaseBoxHeight + 3.5;
  });

  // ==========================================
  // SECTION CERTIFICATIONS & RESSOURCES
  // ==========================================
  if (currentY > pageHeight - 40) {
    doc.addPage();
    currentY = margin;
  } else {
    currentY += 4;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...darkNavy);
  doc.text("4. Certifications Recommandées & Plateformes", margin, currentY);
  currentY += 5;

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, currentY, contentWidth, 18, 2, 2, 'FD');

  const certs = (career.certifications || [
    "Certifications Officielles (Google, AWS, Meta, CompTIA)",
    "Parcours vérifiés sur Coursera, freeCodeCamp & OpenClassrooms"
  ]).join('  •  ');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...darkNavy);
  doc.text(doc.splitTextToSize(`Certifications reconnues : ${certs}`, contentWidth - 10), margin + 5, currentY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...primaryColor);
  doc.text("Ressources gratuites recommandées : freeCodeCamp, MDN Web Docs, CS50 Harvard, GitHub Education.", margin + 5, currentY + 13);

  currentY += 24;

  // ==========================================
  // PIED DE PAGE & SCEAU D'AUTHENTICITÉ
  // ==========================================
  if (currentY > pageHeight - 25) {
    doc.addPage();
    currentY = pageHeight - 25;
  }

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...textMuted);
  doc.text("Document officiel généré par Parcours AI — Conseiller Carrière Intelligent & Mentor Numérique", margin, pageHeight - 10);
  doc.text("Authenticité vérifiable sur parcours.ai", pageWidth - margin - 45, pageHeight - 10);

  // Téléchargement du document
  const fileName = `Parcours_AI_${career.title.replace(/[^a-zA-Z0-9]/g, '_')}_Roadmap.pdf`;
  doc.save(fileName);
}
