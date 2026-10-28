export const initialStudents = [
  { id: 1, name: "Helena Martins", initials: "HM", course: "Piano", level: "Intermediário", teacher: "Ana Ribeiro", status: "Ativo", attendance: 94, progress: 78, phone: "(11) 98842-1076", email: "helena.martins@email.com", nextClass: "Hoje, 14:30", color: "yellow" },
  { id: 2, name: "Theo Almeida", initials: "TA", course: "Violão", level: "Iniciante", teacher: "Rafael Costa", status: "Ativo", attendance: 88, progress: 62, phone: "(11) 99731-5502", email: "theo.almeida@email.com", nextClass: "Hoje, 16:00", color: "cyan" },
  { id: 3, name: "Luna Ferreira", initials: "LF", course: "Canto", level: "Avançado", teacher: "Marina Lopes", status: "Ativo", attendance: 97, progress: 91, phone: "(11) 98221-4019", email: "luna.ferreira@email.com", nextClass: "Amanhã, 10:00", color: "violet" },
  { id: 4, name: "Enzo Carvalho", initials: "EC", course: "Bateria", level: "Intermediário", teacher: "Diego Santos", status: "Pendente", attendance: 76, progress: 54, phone: "(11) 99104-2388", email: "enzo.carvalho@email.com", nextClass: "30 out, 17:30", color: "orange" },
  { id: 5, name: "Alice Nogueira", initials: "AN", course: "Violino", level: "Iniciante", teacher: "Ana Ribeiro", status: "Ativo", attendance: 91, progress: 69, phone: "(11) 98445-0901", email: "alice.nogueira@email.com", nextClass: "30 out, 09:00", color: "green" },
  { id: 6, name: "Miguel Oliveira", initials: "MO", course: "Guitarra", level: "Avançado", teacher: "Rafael Costa", status: "Ativo", attendance: 89, progress: 84, phone: "(11) 99812-7640", email: "miguel.oliveira@email.com", nextClass: "31 out, 19:00", color: "cyan" },
  { id: 7, name: "Sofia Rodrigues", initials: "SR", course: "Piano", level: "Iniciante", teacher: "Marina Lopes", status: "Inativo", attendance: 64, progress: 31, phone: "(11) 98117-3329", email: "sofia.rodrigues@email.com", nextClass: "Sem aula agendada", color: "violet" },
  { id: 8, name: "Davi Mendes", initials: "DM", course: "Baixo", level: "Intermediário", teacher: "Diego Santos", status: "Ativo", attendance: 93, progress: 73, phone: "(11) 99627-8105", email: "davi.mendes@email.com", nextClass: "01 nov, 11:30", color: "yellow" },
];

export const initialClasses = [
  { id: 1, day: 3, start: "09:00", end: "09:50", student: "Alice Nogueira", course: "Violino", teacher: "Ana Ribeiro", room: "Sala 02", type: "Individual", status: "Confirmada" },
  { id: 2, day: 3, start: "10:30", end: "11:20", student: "Turma Iniciação", course: "Musicalização", teacher: "Marina Lopes", room: "Sala 04", type: "Coletiva", status: "Confirmada" },
  { id: 3, day: 3, start: "14:30", end: "15:20", student: "Helena Martins", course: "Piano", teacher: "Ana Ribeiro", room: "Sala 01", type: "Individual", status: "Confirmada" },
  { id: 4, day: 3, start: "16:00", end: "16:50", student: "Theo Almeida", course: "Violão", teacher: "Rafael Costa", room: "Sala 03", type: "Individual", status: "Pendente" },
  { id: 5, day: 3, start: "18:00", end: "19:00", student: "Ensemble Jovem", course: "Prática de banda", teacher: "Diego Santos", room: "Estúdio", type: "Coletiva", status: "Confirmada" },
  { id: 6, day: 4, start: "10:00", end: "10:50", student: "Luna Ferreira", course: "Canto", teacher: "Marina Lopes", room: "Sala 02", type: "Individual", status: "Confirmada" },
  { id: 7, day: 4, start: "17:30", end: "18:20", student: "Enzo Carvalho", course: "Bateria", teacher: "Diego Santos", room: "Estúdio", type: "Individual", status: "Confirmada" },
  { id: 8, day: 5, start: "11:30", end: "12:20", student: "Davi Mendes", course: "Baixo", teacher: "Rafael Costa", room: "Sala 03", type: "Individual", status: "Confirmada" },
  { id: 9, day: 5, start: "19:00", end: "19:50", student: "Miguel Oliveira", course: "Guitarra", teacher: "Rafael Costa", room: "Sala 03", type: "Individual", status: "Confirmada" },
];

export const initialGroups = [
  { id: 1, name: "Ensemble Jovem", course: "Prática de banda", teacher: "Diego Santos", students: 12, capacity: 15, schedule: "Quintas · 18:00", room: "Estúdio", level: "Intermediário" },
  { id: 2, name: "Iniciação Musical", course: "Musicalização", teacher: "Marina Lopes", students: 9, capacity: 12, schedule: "Quintas · 10:30", room: "Sala 04", level: "Iniciante" },
  { id: 3, name: "Piano em Conjunto", course: "Piano", teacher: "Ana Ribeiro", students: 6, capacity: 8, schedule: "Sábados · 09:00", room: "Sala 01", level: "Iniciante" },
  { id: 4, name: "Voz & Harmonia", course: "Canto", teacher: "Marina Lopes", students: 10, capacity: 10, schedule: "Terças · 19:00", room: "Sala 02", level: "Avançado" },
];

export const initialTransactions = [
  { id: 1, student: "Helena Martins", description: "Mensalidade · Piano", due: "05 out 2026", amount: 420, status: "Pago", method: "Pix" },
  { id: 2, student: "Theo Almeida", description: "Mensalidade · Violão", due: "08 out 2026", amount: 360, status: "Pago", method: "Cartão" },
  { id: 3, student: "Luna Ferreira", description: "Mensalidade · Canto", due: "10 out 2026", amount: 450, status: "Pago", method: "Pix" },
  { id: 4, student: "Enzo Carvalho", description: "Mensalidade · Bateria", due: "15 out 2026", amount: 390, status: "Atrasado", method: "Boleto" },
  { id: 5, student: "Alice Nogueira", description: "Mensalidade · Violino", due: "20 out 2026", amount: 460, status: "Pago", method: "Pix" },
  { id: 6, student: "Miguel Oliveira", description: "Mensalidade · Guitarra", due: "28 out 2026", amount: 410, status: "Pendente", method: "Boleto" },
  { id: 7, student: "Davi Mendes", description: "Mensalidade · Baixo", due: "30 out 2026", amount: 380, status: "Pendente", method: "Pix" },
  { id: 8, student: "Sofia Rodrigues", description: "Mensalidade · Piano", due: "02 out 2026", amount: 420, status: "Atrasado", method: "Boleto" },
];

export const initialEvaluations = [
  { id: 1, studentId: 1, date: "24 out 2026", title: "Leitura rítmica", note: "Evoluiu na leitura de compassos compostos. Manter exercícios com metrônomo.", score: 8.5 },
  { id: 2, studentId: 1, date: "10 out 2026", title: "Repertório · Debussy", note: "Boa interpretação e controle de pedal. Revisar dinâmica no segundo tema.", score: 9.0 },
  { id: 3, studentId: 2, date: "21 out 2026", title: "Troca de acordes", note: "Transições mais fluidas entre os acordes abertos.", score: 7.5 },
];

export const initialNotifications = [
  { id: 1, title: "Pagamento em atraso", text: "A mensalidade de Enzo está pendente há 14 dias.", time: "12 min", type: "warning", read: false },
  { id: 2, title: "Aula aguardando confirmação", text: "Theo Almeida · hoje às 16:00.", time: "38 min", type: "info", read: false },
  { id: 3, title: "Meta mensal atualizada", text: "A receita de outubro atingiu 82% da meta.", time: "2 h", type: "success", read: true },
];

export const revenueSeries = [42, 55, 48, 68, 61, 76, 71, 88, 82, 94, 89, 100];
export const weekdays = [
  { short: "SEG", day: 26 },
  { short: "TER", day: 27 },
  { short: "QUA", day: 28 },
  { short: "QUI", day: 29 },
  { short: "SEX", day: 30 },
  { short: "SÁB", day: 31 },
];
