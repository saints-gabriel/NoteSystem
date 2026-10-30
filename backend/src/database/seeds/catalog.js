export const courses = [
  { name: "Piano", category: "Instrumento", monthlyFee: 420 },
  { name: "Violão", category: "Instrumento", monthlyFee: 360 },
  { name: "Guitarra", category: "Instrumento", monthlyFee: 410 },
  { name: "Canto", category: "Voz", monthlyFee: 450 },
  { name: "Bateria", category: "Instrumento", monthlyFee: 390 },
  { name: "Violino", category: "Instrumento", monthlyFee: 460 },
  { name: "Baixo", category: "Instrumento", monthlyFee: 380 },
  { name: "Musicalização", category: "Musicalização", monthlyFee: 280 },
  { name: "Prática de banda", category: "Prática coletiva", monthlyFee: 300 },
];

export const rooms = [
  { name: "Sala 01", capacity: 4, equipment: "Piano de armário, estantes" },
  { name: "Sala 02", capacity: 4, equipment: "Teclado, espelho para canto" },
  { name: "Sala 03", capacity: 3, equipment: "Amplificadores de guitarra e baixo" },
  { name: "Sala 04", capacity: 15, equipment: "Percussão leve, tapetes" },
  { name: "Estúdio", capacity: 12, equipment: "Bateria, PA, microfones" },
];

export const teachers = [
  {
    name: "Ana Ribeiro",
    email: "professor@notesystem.local",
    courses: ["Piano", "Violino"],
    commissionRate: 0.45,
  },
  {
    name: "Rafael Costa",
    email: "rafael.costa@notesystem.local",
    courses: ["Violão", "Guitarra", "Baixo"],
    commissionRate: 0.45,
  },
  {
    name: "Marina Lopes",
    email: "marina.lopes@notesystem.local",
    courses: ["Canto", "Musicalização", "Piano"],
    commissionRate: 0.5,
  },
  {
    name: "Diego Santos",
    email: "diego.santos@notesystem.local",
    courses: ["Bateria", "Baixo", "Prática de banda"],
    commissionRate: 0.45,
  },
];

export const plans = [
  {
    name: "Individual semanal",
    description: "Uma aula individual por semana, mensalidade fixa.",
    price: 420,
    discount: 0,
  },
  { name: "Turma coletiva", description: "Aulas coletivas com até 15 alunos.", price: 280, discount: 0 },
  {
    name: "Desconto por irmãos",
    description: "Aplicado ao segundo aluno da mesma família.",
    price: 0,
    discount: 10,
  },
];

export const events = [
  {
    title: "Aula aberta de instrumentos",
    date: "2026-11-08",
    location: "Estúdio",
    description: "Visitantes experimentam instrumentos com os professores.",
  },
  {
    title: "Workshop de percussão",
    date: "2026-11-22",
    location: "Sala 04",
    description: "Oficina aberta aos alunos de bateria e musicalização.",
  },
  {
    title: "Masterclass de canto",
    date: "2026-12-02",
    location: "Sala 02",
    description: "Convidada especial para alunos avançados.",
  },
  {
    title: "Recital de fim de ano",
    date: "2026-12-15",
    location: "Auditório parceiro",
    description: "Apresentação dos alunos com repertório do semestre.",
  },
];
