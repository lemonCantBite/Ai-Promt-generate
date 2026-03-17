const form = document.getElementById("promptForm");
const seedInput = document.getElementById("seedInput");
const promptList = document.getElementById("promptList");
const count = document.getElementById("count");
const copyAll = document.getElementById("copyAll");
const shuffleBtn = document.getElementById("shuffleBtn");
const chipRow = document.getElementById("chipRow");

const angles = {
  visual: [
    "cinematic lighting",
    "minimalist composition",
    "macro detail focus",
    "soft natural light",
    "bold color blocking",
    "retro film grain",
  ],
  branding: [
    "brand voice guide",
    "logo direction",
    "visual identity system",
    "tagline exploration",
    "brand story arc",
  ],
  writing: [
    "short story",
    "poetic micro-essay",
    "product description",
    "newsletter opener",
    "scripted dialogue",
  ],
  product: [
    "feature list",
    "user journey",
    "MVP scope",
    "UX flow",
    "risk checklist",
  ],
  marketing: [
    "campaign concept",
    "ad copy variants",
    "social hooks",
    "launch plan",
    "SEO outline",
  ],
};

const styles = [
  "warm and human",
  "clean and modern",
  "bold and punchy",
  "calm and elegant",
  "playful but polished",
  "high-end editorial",
  "futuristic but grounded",
  "story-driven",
];

const constraints = [
  "Use under 120 words.",
  "Add 3 alternative titles.",
  "End with a clear call-to-action.",
  "Include 5 bullet points.",
  "Write in second person.",
  "Add one surprising statistic (invented but plausible).",
  "Keep sentences short and vivid.",
];

const templates = [
  "Create a {style} concept for {seed} with {angle} and 3 variations.",
  "Draft a {angle} for {seed}. Tone: {style}. {constraint}",
  "Generate a detailed prompt to visualize {seed} with {angle}. Add mood, palette, and texture notes.",
  "Write a concise brief for {seed}: goals, audience, deliverables, and success metrics. {constraint}",
  "Turn {seed} into a {angle}. Include a hook, body, and closing line.",
  "Brainstorm 5 fresh directions for {seed} using {angle}. Format as bullets.",
  "Produce a {style} narrative around {seed} that highlights a transformation.",
  "Outline a step-by-step plan to build {seed}. Include risks and mitigations.",
  "Craft a prompt that merges {seed} with a contrasting theme. Mention {angle}.",
  "Design a {style} identity for {seed} including color palette, typography, and imagery cues.",
  "Write a social post series (5 posts) about {seed}. Each post uses a different {angle}.",
  "Create a {style} landing page outline for {seed}. {constraint}",
  "Invent three taglines for {seed} and explain the strategy behind each.",
  "Draft a pitch deck slide outline for {seed} with problem, solution, market, and traction.",
  "Make a customer journey for {seed} from discovery to loyalty. {constraint}",
  "Generate 10 keyword ideas for {seed} and cluster them by intent.",
  "Write a cinematic scene inspired by {seed}. Specify {angle} and setting.",
  "Sketch an app feature list for {seed}, prioritizing MVP and next iteration.",
  "Create a persona for {seed}'s ideal user with goals, pain points, and habits.",
  "Propose a launch plan for {seed} with timeline, channels, and KPIs.",
  "Design a workshop for {seed} that ends with a tangible deliverable.",
  "Summarize {seed} into a one-line manifesto, then expand into 5 supporting points.",
  "Generate three wildly different metaphors to explain {seed} to newcomers.",
  "Write an email sequence (3 emails) to onboard users to {seed}.",
  "Create a research plan to validate {seed}. Include methods and sample questions.",
  "Build a feature comparison table for {seed} vs. two competitors (invent them).",
  "Draft a creative brief for {seed} with target emotion, visuals, and CTA.",
  "Create a mood board description for {seed} with {angle} and {style} cues.",
  "Write a set of interview questions to learn about people who need {seed}.",
  "Develop a pricing ladder for {seed} with three tiers and value anchors.",
];

let activeChip = "";

function randomPick(list) {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

function shuffle(list) {
  const items = [...list];
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function applyTemplate(template, seed) {
  const angle = activeChip && angles[activeChip] ? randomPick(angles[activeChip]) : randomPick(Object.values(angles).flat());
  return template
    .replace("{seed}", seed)
    .replace("{style}", randomPick(styles))
    .replace("{angle}", angle)
    .replace("{constraint}", randomPick(constraints));
}

function generatePrompts(seed) {
  const results = new Set();
  const bag = shuffle(templates);

  bag.forEach((template) => {
    if (results.size >= 10) return;
    results.add(applyTemplate(template, seed));
  });

  let safety = 0;
  while (results.size < 10 && safety < 40) {
    const template = randomPick(templates);
    results.add(applyTemplate(template, seed));
    safety += 1;
  }

  while (results.size < 10) {
    results.add(`Create a fresh prompt about ${seed} that explores a new angle.`);
  }

  return Array.from(results).slice(0, 10);
}

function render(prompts) {
  promptList.innerHTML = "";
  prompts.forEach((text) => {
    const item = document.createElement("li");
    item.className = "prompt-item";

    const content = document.createElement("p");
    content.className = "prompt-text";
    content.textContent = text;

    const button = document.createElement("button");
    button.className = "copy-btn";
    button.type = "button";
    button.textContent = "Copy";
    button.dataset.prompt = text;

    item.appendChild(content);
    item.appendChild(button);
    promptList.appendChild(item);
  });

  count.textContent = `${prompts.length} of 10 ready`;
}

function handleSubmit(event) {
  event.preventDefault();
  const seed = seedInput.value.trim();
  if (!seed) return;
  render(generatePrompts(seed));
}

function handleCopyAll() {
  const prompts = Array.from(promptList.querySelectorAll(".prompt-text")).map(
    (node) => node.textContent
  );
  if (!prompts.length) return;
  navigator.clipboard.writeText(prompts.join("\n\n"));
}

function handleCopyOne(event) {
  const button = event.target.closest("button");
  if (!button || !button.dataset.prompt) return;
  navigator.clipboard.writeText(button.dataset.prompt);
  button.textContent = "Copied";
  setTimeout(() => {
    button.textContent = "Copy";
  }, 1000);
}

function setActiveChip(chip) {
  const chips = Array.from(chipRow.querySelectorAll(".chip"));
  chips.forEach((item) => {
    item.classList.toggle("active", item.dataset.chip === chip);
  });
  activeChip = chip;
}

form.addEventListener("submit", handleSubmit);
copyAll.addEventListener("click", handleCopyAll);
promptList.addEventListener("click", handleCopyOne);
shuffleBtn.addEventListener("click", () => {
  const seed = seedInput.value.trim();
  if (!seed) return;
  render(generatePrompts(seed));
});
chipRow.addEventListener("click", (event) => {
  const chip = event.target.closest("button");
  if (!chip) return;
  const value = chip.dataset.chip;
  setActiveChip(value === activeChip ? "" : value);
});

render([]);
