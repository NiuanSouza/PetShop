import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // ── Categorias de Produtos ──
  const catAlimentacao = await prisma.category.upsert({
    where: { name: 'Alimentação' },
    update: {},
    create: { name: 'Alimentação', imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=300&fit=crop' },
  });
  const catBrinquedos = await prisma.category.upsert({
    where: { name: 'Brinquedos' },
    update: {},
    create: { name: 'Brinquedos', imageUrl: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=400&h=300&fit=crop' },
  });
  const catAcessorios = await prisma.category.upsert({
    where: { name: 'Acessórios' },
    update: {},
    create: { name: 'Acessórios', imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop' },
  });
  const catHigiene = await prisma.category.upsert({
    where: { name: 'Higiene' },
    update: {},
    create: { name: 'Higiene', imageUrl: 'https://images.unsplash.com/photo-1583337130417-13104dec14a7?w=400&h=300&fit=crop' },
  });
  const catMedicamentos = await prisma.category.upsert({
    where: { name: 'Medicamentos' },
    update: {},
    create: { name: 'Medicamentos', imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop' },
  });

  // ── Marcas ──
  const brandPremier = await prisma.brand.upsert({ where: { name: 'PremieR' }, update: {}, create: { name: 'PremieR' } });
  const brandRoyal = await prisma.brand.upsert({ where: { name: 'Royal Canin' }, update: {}, create: { name: 'Royal Canin' } });
  const brandPedigree = await prisma.brand.upsert({ where: { name: 'Pedigree' }, update: {}, create: { name: 'Pedigree' } });
  const brandWhiskas = await prisma.brand.upsert({ where: { name: 'Whiskas' }, update: {}, create: { name: 'Whiskas' } });
  const brandFerplast = await prisma.brand.upsert({ where: { name: 'Ferplast' }, update: {}, create: { name: 'Ferplast' } });
  const brandKong = await prisma.brand.upsert({ where: { name: 'Kong' }, update: {}, create: { name: 'Kong' } });
  const brandVetnil = await prisma.brand.upsert({ where: { name: 'Vetnil' }, update: {}, create: { name: 'Vetnil' } });

  // ── Produtos (15+) ──
  const products = [
    { name: 'Ração PremieR Cães Adultos 15kg', price: 189.90, description: 'Ração super premium para cães adultos de porte médio e grande. Formulação com ingredientes nobres para nutrição completa.', imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop', stock: 25, species: 'cachorro', categoryId: catAlimentacao.id, brandId: brandPremier.id },
    { name: 'Ração Royal Canin Gatos Adultos 7,5kg', price: 219.90, description: 'Nutrição especialmente formulada para gatos adultos com saúde urinária equilibrada.', imageUrl: 'https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?w=400&h=400&fit=crop', stock: 18, species: 'gato', categoryId: catAlimentacao.id, brandId: brandRoyal.id },
    { name: 'Ração Pedigree Filhotes 10kg', price: 89.90, description: 'Ração completa para filhotes com DHA para desenvolvimento cerebral e visual.', imageUrl: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400&h=400&fit=crop', stock: 30, species: 'cachorro', categoryId: catAlimentacao.id, brandId: brandPedigree.id },
    { name: 'Sachê Whiskas Atum 85g (12 un)', price: 45.90, description: 'Pack com 12 sachês de atum ao molho para gatos adultos.', imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop', stock: 40, species: 'gato', categoryId: catAlimentacao.id, brandId: brandWhiskas.id },
    { name: 'Ração para Peixes Tropicais 100g', price: 29.90, description: 'Alimento completo em flocos para peixes tropicais de aquário.', imageUrl: 'https://images.unsplash.com/photo-1520990497783-5e5622f6e3ec?w=400&h=400&fit=crop', stock: 35, species: 'peixe', categoryId: catAlimentacao.id, brandId: brandFerplast.id },
    { name: 'Brinquedo Kong Classic M', price: 79.90, description: 'Brinquedo de borracha ultra resistente para cães. Ideal para rechear com petiscos.', imageUrl: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=400&h=400&fit=crop', stock: 20, species: 'cachorro', categoryId: catBrinquedos.id, brandId: brandKong.id },
    { name: 'Varinha com Penas para Gatos', price: 24.90, description: 'Brinquedo interativo com penas naturais que estimula o instinto de caça.', imageUrl: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&h=400&fit=crop', stock: 30, species: 'gato', categoryId: catBrinquedos.id, brandId: brandFerplast.id },
    { name: 'Bolinha com Guizo (3 un)', price: 19.90, description: 'Kit com 3 bolinhas coloridas com guizo para gatos.', imageUrl: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=400&h=400&fit=crop', stock: 45, species: 'gato', categoryId: catBrinquedos.id, brandId: brandFerplast.id },
    { name: 'Coleira Ajustável Nylon M', price: 34.90, description: 'Coleira de nylon com fivela de segurança para cães de porte médio.', imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop', stock: 25, species: 'cachorro', categoryId: catAcessorios.id, brandId: brandFerplast.id },
    { name: 'Cama Pet Retangular G', price: 129.90, description: 'Cama acolchoada para cães de porte grande com tecido impermeável.', imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=400&fit=crop', stock: 12, species: 'cachorro', categoryId: catAcessorios.id, brandId: brandFerplast.id },
    { name: 'Arranhador Torre para Gatos', price: 159.90, description: 'Arranhador torre com 3 níveis, rede e brinquedo pendurado.', imageUrl: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&h=400&fit=crop', stock: 8, species: 'gato', categoryId: catAcessorios.id, brandId: brandFerplast.id },
    { name: 'Aquário Completo 50L', price: 299.90, description: 'Kit aquário 50 litros com filtro, termostato, iluminação LED e tampa.', imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop', stock: 6, species: 'peixe', categoryId: catAcessorios.id, brandId: brandFerplast.id },
    { name: 'Shampoo Neutro para Cães 500ml', price: 32.90, description: 'Shampoo neutro hipoalergênico para cães com pH balanceado.', imageUrl: 'https://images.unsplash.com/photo-1583337130417-13104dec14a7?w=400&h=400&fit=crop', stock: 22, species: 'cachorro', categoryId: catHigiene.id, brandId: brandVetnil.id },
    { name: 'Areia Higiênica para Gatos 4kg', price: 19.90, description: 'Areia sanitária aglomerante com controle de odores para gatos.', imageUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop', stock: 50, species: 'gato', categoryId: catHigiene.id, brandId: brandFerplast.id },
    { name: 'Tapete Higiênico 30 un', price: 49.90, description: 'Tapete absorvente para treinamento de filhotes. Ultra absorção.', imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop', stock: 35, species: 'cachorro', categoryId: catHigiene.id, brandId: brandVetnil.id },
    { name: 'Antipulgas e Carrapatos Cães', price: 64.90, description: 'Pipeta antipulgas e carrapatos para cães de 10 a 25kg. Proteção por 30 dias.', imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop', stock: 28, species: 'cachorro', categoryId: catMedicamentos.id, brandId: brandVetnil.id },
    { name: 'Vermífugo Comprimido Cães', price: 22.90, description: 'Vermífugo de amplo espectro para cães até 10kg. Sabor carne.', imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', stock: 40, species: 'cachorro', categoryId: catMedicamentos.id, brandId: brandVetnil.id },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: products.indexOf(p) + 1 },
      update: {},
      create: p,
    });
  }

  // ── Pets à venda / adoção (8+) ──
  const pets = [
    { name: 'Thor', species: 'cachorro', breed: 'Golden Retriever', age: 2, price: 2500.00, description: 'Golden Retriever macho, super dócil e brincalhão. Vacinado e vermifugado. Adora crianças e outros animais.', imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop', status: 'disponivel' },
    { name: 'Luna', species: 'cachorro', breed: 'Labrador', age: 1, price: 2200.00, description: 'Labrador fêmea filhote, muito ativa e inteligente. Ideal para famílias. Já com todas as vacinas.', imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop', status: 'disponivel' },
    { name: 'Bolt', species: 'cachorro', breed: 'Husky Siberiano', age: 3, price: 3200.00, description: 'Husky Siberiano macho com olhos azuis. Pelagem exuberante, temperamento forte mas leal.', imageUrl: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&h=400&fit=crop', status: 'disponivel' },
    { name: 'Mia', species: 'gato', breed: 'Persa', age: 2, price: 1800.00, description: 'Gata Persa fêmea, pelagem branca e sedosa. Temperamento calmo, ideal para apartamento.', imageUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop', status: 'disponivel' },
    { name: 'Simba', species: 'gato', breed: 'Siamês', age: 1, price: 1500.00, description: 'Gato Siamês macho, muito sociável e vocal. Pelagem clara com extremidades escuras.', imageUrl: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=400&fit=crop', status: 'disponivel' },
    { name: 'Nemo', species: 'peixe', breed: 'Betta', age: 1, price: 35.00, description: 'Peixe Betta macho com cores vibrantes em azul e vermelho. Ideal para aquários pequenos.', imageUrl: 'https://images.unsplash.com/photo-1520990497783-5e5622f6e3ec?w=400&h=400&fit=crop', status: 'disponivel' },
    { name: 'Rio', species: 'ave', breed: 'Calopsita', age: 1, price: 280.00, description: 'Calopsita mansa e dócil, já acostumada com manuseio. Canta e assobia melodias.', imageUrl: 'https://images.unsplash.com/photo-1591608971362-f08b2a75731a?w=400&h=400&fit=crop', status: 'disponivel' },
    { name: 'Kiko', species: 'ave', breed: 'Papagaio', age: 2, price: 1200.00, description: 'Papagaio macho com plumagem verde vibrante. Muito inteligente e já fala algumas palavras.', imageUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=400&fit=crop', status: 'disponivel' },
    { name: 'Pipoca', species: 'roedor', breed: 'Hamster Sírio', age: 0, price: 45.00, description: 'Hamster Sírio dourado, super fofo e ativo. Perfeito como primeiro pet para crianças.', imageUrl: 'https://images.unsplash.com/photo-1425082661507-d6d2f6f37f26?w=400&h=400&fit=crop', status: 'disponivel' },
    { name: 'Mel', species: 'roedor', breed: 'Porquinho da Índia', age: 1, price: 80.00, description: 'Porquinho da Índia fêmea, pelagem tricolor. Mansa e sociável, adora carinho.', imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400&h=400&fit=crop', status: 'disponivel' },
  ];

  for (const pet of pets) {
    await prisma.pet.upsert({
      where: { id: pets.indexOf(pet) + 1 },
      update: {},
      create: pet,
    });
  }

  // ── Serviços ──
  const services = [
    { name: 'Banho Completo', description: 'Banho com shampoo e condicionador específicos para o pelo do seu pet. Inclui secagem, escovação, limpeza de orelhas e corte de unhas.', price: 60.00, duration: 60, imageUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&h=300&fit=crop', serviceType: 'banho' },
    { name: 'Tosa Higiênica', description: 'Tosa nas regiões íntimas, patas e focinho para manter a higiene do seu pet. Recomendada a cada 30 dias.', price: 45.00, duration: 45, imageUrl: 'https://images.unsplash.com/photo-1516222338250-863216ce01ea?w=400&h=300&fit=crop', serviceType: 'tosa' },
    { name: 'Tosa Completa', description: 'Tosa completa com estilo personalizado para a raça do seu pet. Inclui banho e hidratação.', price: 90.00, duration: 90, imageUrl: 'https://images.unsplash.com/photo-1516222338250-863216ce01ea?w=400&h=300&fit=crop', serviceType: 'tosa' },
    { name: 'Banho + Tosa', description: 'Combo completo de banho com produtos premium e tosa personalizada. O pacote mais popular!', price: 120.00, duration: 120, imageUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&h=300&fit=crop', serviceType: 'banho' },
    { name: 'Consulta Veterinária', description: 'Consulta completa com veterinário especializado. Inclui exame clínico geral e orientações.', price: 150.00, duration: 30, imageUrl: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&h=300&fit=crop', serviceType: 'veterinaria' },
    { name: 'Vacinação', description: 'Aplicação de vacinas com protocolo completo. Inclui carteirinha de vacinação e acompanhamento.', price: 80.00, duration: 20, imageUrl: 'https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=400&h=300&fit=crop', serviceType: 'vacinacao' },
    { name: 'Hospedagem (diária)', description: 'Hospedagem com espaço amplo, alimentação balanceada e atividades recreativas. Monitoramento 24h.', price: 70.00, duration: 1440, imageUrl: 'https://images.unsplash.com/photo-1601758124510-52d02ddf7cbd?w=400&h=300&fit=crop', serviceType: 'hospedagem' },
  ];

  for (const svc of services) {
    await prisma.service.upsert({
      where: { id: services.indexOf(svc) + 1 },
      update: {},
      create: svc,
    });
  }

  console.log('✅ Seed concluído com sucesso!');
  console.log(`   📦 ${products.length} produtos`);
  console.log(`   🐾 ${pets.length} pets à venda`);
  console.log(`   💈 ${services.length} serviços`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
