export type ResearchEntry = {
  year: string;
  title: string;
  authors?: string;
  summary: string;
  href?: string;
  publisher: string;
};

export type PatentEntry = {
  title: string;
  applicationNumber: string;
  status: string;
};

export const RESEARCH: ResearchEntry[] = [
  {
    year: "BROCHURE LISTING",
    title: "From Footprints to Features: Distilling Vision Transformers for Animal Classification",
    summary:
      "This title is listed in the RUGVED brochure. The brochure does not include an abstract or a public publication link for this item.",
    publisher: "Brochure listing · no public paper link supplied",
  },
  {
    year: "ARXIV · 2026",
    title: "Enhancing Hazy Wildlife Imagery: AnimalHaze3k and IncepDehazeGan",
    authors: "Shivarth Rai, Tejeswar Pokuri",
    summary:
      "Introduces a synthetic dataset of hazy wildlife images and an image-dehazing model, with the aim of improving visibility for wildlife detection and tracking.",
    href: "https://arxiv.org/abs/2604.16284",
    publisher: "Read on arXiv",
  },
  {
    year: "NEURIPS 2024 · SSL WORKSHOP",
    title: "Masked Self-Supervised Pretraining for Semantic Segmentation of Dental Radiographs",
    authors: "Tejeswar Pokuri, Laalenthika Konthalapalli, Sarvesh Kumar, Karthik Bhimavarapu",
    summary:
      "Uses masked-image pretraining with a modified ResUNet to segment teeth from dental X-rays. The paper reports strong results using 20% of the downstream training samples, reducing dependence on manually labeled data.",
    href: "https://openreview.net/forum?id=yUqQi8Pgl7",
    publisher: "Read on OpenReview",
  },
  {
    year: "ARXIV · 2026",
    title: "Hero-Mamba: Mamba-based Dual Domain Learning for Underwater Image Enhancement",
    authors: "Tejeswar Pokuri, Shivarth Rai",
    summary:
      "Combines spatial RGB and frequency-domain information in a Mamba-based model to restore color and detail in degraded underwater images.",
    href: "https://arxiv.org/abs/2604.16266",
    publisher: "Read on arXiv",
  },
  {
    year: "ICLR 2026 · ML4RS WORKSHOP",
    title: "Self-Supervised Pretraining for Power Generation via Dynamic Guided Masking",
    authors: "Ananya Shriram, Advika Srivastava, Ishita Choudhary, Ananya Das, Sarvesh Kumar",
    summary:
      "Uses dynamically guided masking to pretrain on multispectral satellite imagery for estimating power generation, without requiring auxiliary segmentation or classification labels.",
    href: "https://openreview.net/forum?id=m34TWtcYRT",
    publisher: "Read on OpenReview",
  },
  {
    year: "IEEE ACCESS · 2024",
    title: "Detection of Epilepsy Disorder Using Spectrogram Images Generated From Brain EEG Signals",
    authors: "Venkatesh Bhandage, Tejeswar Pokuri, Devansh Desai, J. Andrew",
    summary:
      "Transforms EEG signals into spectrogram images, classifies them with convolutional neural networks, and uses SmoothGradCAM++ and saliency maps to make model decisions more interpretable. The paper reports results across two public datasets.",
    href: "https://doi.org/10.1109/ACCESS.2024.3520861",
    publisher: "Read at IEEE Access",
  },
];

export const PATENTS: PatentEntry[] = [
  {
    title: "Traffic Munda",
    applicationNumber: "202441083423",
    status: "Published · as stated in the brochure",
  },
  {
    title: "Gunshot Detection System",
    applicationNumber: "202441103186",
    status: "Published · as stated in the brochure",
  },
  {
    title: "Re-identification system",
    applicationNumber: "202641043765",
    status: "Status not stated in the brochure",
  },
  {
    title: "Low-light vision system",
    applicationNumber: "202641016771",
    status: "Status not stated in the brochure",
  },
];

export const RESEARCH_DISCLOSURE =
  "The brochure also reports 6+ additional research papers; citations for those further items were not supplied.";

export const PATENT_DISCLOSURE =
  "The brochure reports 17+ additional patent filings, with applications at provisional or complete-specification stages. Titles, numbers and status shown here are transcribed from the brochure; no registry links were supplied.";
