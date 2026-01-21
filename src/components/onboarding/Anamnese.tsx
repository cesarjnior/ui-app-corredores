'use client'

import { useState } from 'react'
import { ChevronRight, ChevronLeft, Check, User, Activity, Target, Heart, Calendar, Clock, MapPin, Volume2, Zap, Edit2 } from 'lucide-react'

export type AnamneseData = {
  // Dados pessoais
  nome: string
  idade: string
  peso: string
  altura: string
  sexo: 'masculino' | 'feminino' | 'outro' | ''

  // Objetivo principal (novo)
  objetivoPrincipal: 'prova' | 'condicionamento' | 'correr_sem_parar' | 'aumentar_distancia' | 'consistencia' | ''
  dataProva: string
  distanciaAlvo: string

  nivelAtividade: 'sedentario' | 'leve' | 'moderado' | 'ativo' | ''

  // Histórico de corrida
  jaCorreuAntes: 'sim' | 'nao' | ''
  tempoParado: string
  maiorDistancia: string
  frequenciaSemanal: string
  ritmoMedio: string

  // Objetivos (mantido para compatibilidade)
  metaDistancia: '3km' | '5km' | '10km' | 'outro' | ''
  objetivos: string[]

  // Limitações/Saúde
  lesaoRecente: 'sim' | 'nao' | ''
  lesaoDescricao: string
  dorAtual: 'sim' | 'nao' | ''
  dorDescricao: string
  permissaoMedica: 'sim' | 'nao' | 'nao_sei' | ''
  restricoes: string[]

  // Preferências de treino
  diasDisponiveis: string[]
  tempoDisponivel: '20-30min' | '30-45min' | '45-60min' | '60+min' | ''
  localTreino: string[]
  tipoTreinoPreferido: string[]
  preferenciaGuia: 'audio' | 'texto' | 'ambos' | ''

  // Motivação
  motivacoes: string[]
  nivelDisciplina: number
  notificacoesMotivacionais: 'sim' | 'nao' | ''
}

interface AnamneseProps {
  onComplete: (data: AnamneseData) => void
  onBack: () => void
}

export default function Anamnese({ onComplete, onBack }: AnamneseProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<AnamneseData>({
    nome: '',
    idade: '',
    peso: '',
    altura: '',
    sexo: '',
    objetivoPrincipal: '',
    dataProva: '',
    distanciaAlvo: '',
    nivelAtividade: '',
    jaCorreuAntes: '',
    tempoParado: '',
    maiorDistancia: '',
    frequenciaSemanal: '',
    ritmoMedio: '',
    metaDistancia: '',
    objetivos: [],
    lesaoRecente: '',
    lesaoDescricao: '',
    dorAtual: '',
    dorDescricao: '',
    permissaoMedica: '',
    restricoes: [],
    diasDisponiveis: [],
    tempoDisponivel: '',
    localTreino: [],
    tipoTreinoPreferido: [],
    preferenciaGuia: '',
    motivacoes: [],
    nivelDisciplina: 3,
    notificacoesMotivacionais: '',
  })

  const totalSteps = 8

  const updateData = (field: keyof AnamneseData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    onComplete(data)
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return data.nome.trim() !== ''
      case 2:
        return data.objetivoPrincipal !== '' &&
               (data.objetivoPrincipal !== 'prova' || data.dataProva !== '') &&
               (data.objetivoPrincipal !== 'aumentar_distancia' || data.distanciaAlvo !== '')
      case 3:
        return data.nivelAtividade !== ''
      case 4:
        return data.jaCorreuAntes !== ''
      case 5:
        return data.diasDisponiveis.length > 0
      case 6:
        return data.lesaoRecente !== '' && data.dorAtual !== '' && data.permissaoMedica !== ''
      case 7:
        return data.tempoDisponivel !== ''
      case 8:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4FB3F6] to-[#0A2540] p-6 pb-8 text-white">
        <div className="flex items-center space-x-4 mb-6">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Questionário</h1>
            <p className="text-white/80">Passo {currentStep} de {totalSteps}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="p-6 pb-24">
        {/* Step 1: Dados Pessoais */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <User className="w-12 h-12 text-[#4FB3F6] mx-auto" />
              <h2 className="text-2xl font-bold text-[#0A2540]">Vamos nos conhecer</h2>
              <p className="text-gray-600">Algumas informações básicas</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nome completo</label>
                <input
                  type="text"
                  value={data.nome}
                  onChange={(e) => updateData('nome', e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#4FB3F6] focus:outline-none text-lg"
                  placeholder="Seu nome"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Idade</label>
                  <input
                    type="number"
                    value={data.idade}
                    onChange={(e) => updateData('idade', e.target.value)}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#4FB3F6] focus:outline-none text-lg"
                    placeholder="30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Sexo</label>
                  <select
                    value={data.sexo}
                    onChange={(e) => updateData('sexo', e.target.value)}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#4FB3F6] focus:outline-none text-lg"
                  >
                    <option value="">Selecionar</option>
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Objetivo Principal */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Target className="w-12 h-12 text-[#4FB3F6] mx-auto" />
              <h2 className="text-2xl font-bold text-[#0A2540]">Qual é seu objetivo principal?</h2>
              <p className="text-gray-600">Isso nos ajuda a criar o plano ideal</p>
            </div>

            <div className="space-y-3">
              {[
                { value: 'prova', label: 'Praticar para uma prova', desc: 'Tenho uma corrida marcada' },
                { value: 'condicionamento', label: 'Melhorar condicionamento geral', desc: 'Ficar mais forte e saudável' },
                { value: 'correr_sem_parar', label: 'Correr sem parar', desc: 'Eliminar caminhadas na corrida' },
                { value: 'aumentar_distancia', label: 'Aumentar distância', desc: 'Correr mais quilômetros' },
                { value: 'consistencia', label: 'Criar consistência', desc: 'Manter rotina de treinos' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateData('objetivoPrincipal', option.value)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    data.objetivoPrincipal === option.value
                      ? 'border-[#4FB3F6] bg-[#4FB3F6]/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-[#0A2540]">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.desc}</div>
                </button>
              ))}
            </div>

            {/* Campos adicionais baseados no objetivo */}
            {data.objetivoPrincipal === 'prova' && (
              <div className="space-y-4 mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Data da prova</label>
                  <input
                    type="date"
                    value={data.dataProva}
                    onChange={(e) => updateData('dataProva', e.target.value)}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#4FB3F6] focus:outline-none text-lg"
                  />
                </div>
              </div>
            )}

            {data.objetivoPrincipal === 'aumentar_distancia' && (
              <div className="space-y-4 mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Distância-alvo</label>
                  <input
                    type="text"
                    value={data.distanciaAlvo}
                    onChange={(e) => updateData('distanciaAlvo', e.target.value)}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#4FB3F6] focus:outline-none text-lg"
                    placeholder="Ex: 10km, meia maratona"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Nível Atual */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Activity className="w-12 h-12 text-[#4FB3F6] mx-auto" />
              <h2 className="text-2xl font-bold text-[#0A2540]">Qual é seu nível atual?</h2>
              <p className="text-gray-600">Selecione a opção que melhor descreve sua atividade física</p>
            </div>

            <div className="space-y-3">
              {[
                { value: 'sedentario', label: 'Sedentário', desc: 'Pouca ou nenhuma atividade física' },
                { value: 'leve', label: 'Iniciante', desc: 'Atividade leve, caminhadas ocasionais' },
                { value: 'moderado', label: 'Intermediário leve', desc: 'Atividade moderada regular' },
                { value: 'ativo', label: 'Ativo', desc: 'Atividade intensa frequente' },
              ].map((level) => (
                <button
                  key={level.value}
                  onClick={() => updateData('nivelAtividade', level.value)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    data.nivelAtividade === level.value
                      ? 'border-[#4FB3F6] bg-[#4FB3F6]/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-[#0A2540]">{level.label}</div>
                  <div className="text-sm text-gray-600">{level.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Histórico de Corrida */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Heart className="w-12 h-12 text-[#4FB3F6] mx-auto" />
              <h2 className="text-2xl font-bold text-[#0A2540]">Histórico de corrida</h2>
              <p className="text-gray-600">Conte-nos sobre sua experiência</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#0A2540]">Você já correu antes?</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => updateData('jaCorreuAntes', 'sim')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      data.jaCorreuAntes === 'sim'
                        ? 'border-[#4FB3F6] bg-[#4FB3F6]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">✅</div>
                      <div className="font-semibold">Sim</div>
                    </div>
                  </button>
                  <button
                    onClick={() => updateData('jaCorreuAntes', 'nao')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      data.jaCorreuAntes === 'nao'
                        ? 'border-[#4FB3F6] bg-[#4FB3F6]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">🚀</div>
                      <div className="font-semibold">Não</div>
                    </div>
                  </button>
                </div>
              </div>

              {data.jaCorreuAntes === 'sim' && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Quanto tempo parou de correr?</label>
                    <select
                      value={data.tempoParado}
                      onChange={(e) => updateData('tempoParado', e.target.value)}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#4FB3F6] focus:outline-none text-lg"
                    >
                      <option value="">Selecionar</option>
                      <option value="menos_1_mes">Menos de 1 mês</option>
                      <option value="1_3_meses">1-3 meses</option>
                      <option value="3_6_meses">3-6 meses</option>
                      <option value="6_12_meses">6-12 meses</option>
                      <option value="mais_1_ano">Mais de 1 ano</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Maior distância já corrida</label>
                    <input
                      type="text"
                      value={data.maiorDistancia}
                      onChange={(e) => updateData('maiorDistancia', e.target.value)}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#4FB3F6] focus:outline-none text-lg"
                      placeholder="Ex: 5km, 10km"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 5: Dias Disponíveis */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Calendar className="w-12 h-12 text-[#4FB3F6] mx-auto" />
              <h2 className="text-2xl font-bold text-[#0A2540]">Dias disponíveis para treinar</h2>
              <p className="text-gray-600">Selecione todos os dias que você pode treinar</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'segunda', label: 'Segunda' },
                { value: 'terca', label: 'Terça' },
                { value: 'quarta', label: 'Quarta' },
                { value: 'quinta', label: 'Quinta' },
                { value: 'sexta', label: 'Sexta' },
                { value: 'sabado', label: 'Sábado' },
                { value: 'domingo', label: 'Domingo' },
              ].map((day) => (
                <button
                  key={day.value}
                  onClick={() => {
                    const newDays = data.diasDisponiveis.includes(day.value)
                      ? data.diasDisponiveis.filter(d => d !== day.value)
                      : [...data.diasDisponiveis, day.value]
                    updateData('diasDisponiveis', newDays)
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    data.diasDisponiveis.includes(day.value)
                      ? 'border-[#4FB3F6] bg-[#4FB3F6]/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-semibold text-[#0A2540]">{day.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Limitações e Saúde */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Heart className="w-12 h-12 text-[#4FB3F6] mx-auto" />
              <h2 className="text-2xl font-bold text-[#0A2540]">Saúde e limitações</h2>
              <p className="text-gray-600">Sua segurança é nossa prioridade</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#0A2540]">Você teve alguma lesão recente?</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => updateData('lesaoRecente', 'nao')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      data.lesaoRecente === 'nao'
                        ? 'border-[#4FB3F6] bg-[#4FB3F6]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">✅</div>
                      <div className="font-semibold">Não</div>
                    </div>
                  </button>
                  <button
                    onClick={() => updateData('lesaoRecente', 'sim')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      data.lesaoRecente === 'sim'
                        ? 'border-[#4FB3F6] bg-[#4FB3F6]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">⚠️</div>
                      <div className="font-semibold">Sim</div>
                    </div>
                  </button>
                </div>

                {data.lesaoRecente === 'sim' && (
                  <div className="space-y-2 p-4 bg-red-50 rounded-xl border border-red-200">
                    <label className="text-sm font-medium text-red-700">Descreva a lesão</label>
                    <textarea
                      value={data.lesaoDescricao}
                      onChange={(e) => updateData('lesaoDescricao', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-400 focus:outline-none text-lg"
                      placeholder="Onde dói? Há quanto tempo? Como aconteceu?"
                      rows={3}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#0A2540]">Você sente alguma dor agora?</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => updateData('dorAtual', 'nao')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      data.dorAtual === 'nao'
                        ? 'border-[#4FB3F6] bg-[#4FB3F6]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">✅</div>
                      <div className="font-semibold">Não</div>
                    </div>
                  </button>
                  <button
                    onClick={() => updateData('dorAtual', 'sim')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      data.dorAtual === 'sim'
                        ? 'border-[#4FB3F6] bg-[#4FB3F6]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">⚠️</div>
                      <div className="font-semibold">Sim</div>
                    </div>
                  </button>
                </div>

                {data.dorAtual === 'sim' && (
                  <div className="space-y-2 p-4 bg-red-50 rounded-xl border border-red-200">
                    <label className="text-sm font-medium text-red-700">Descreva a dor</label>
                    <textarea
                      value={data.dorDescricao}
                      onChange={(e) => updateData('dorDescricao', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-400 focus:outline-none text-lg"
                      placeholder="Onde dói? Intensidade? Quando acontece?"
                      rows={3}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#0A2540]">Você tem permissão médica para praticar atividade física?</h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => updateData('permissaoMedica', 'sim')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      data.permissaoMedica === 'sim'
                        ? 'border-[#4FB3F6] bg-[#4FB3F6]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">✅</div>
                      <div className="font-semibold text-sm">Sim</div>
                    </div>
                  </button>
                  <button
                    onClick={() => updateData('permissaoMedica', 'nao')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      data.permissaoMedica === 'nao'
                        ? 'border-[#4FB3F6] bg-[#4FB3F6]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">❌</div>
                      <div className="font-semibold text-sm">Não</div>
                    </div>
                  </button>
                  <button
                    onClick={() => updateData('permissaoMedica', 'nao_sei')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      data.permissaoMedica === 'nao_sei'
                        ? 'border-[#4FB3F6] bg-[#4FB3F6]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">🤔</div>
                      <div className="font-semibold text-sm">Não sei</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Tempo Disponível */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Clock className="w-12 h-12 text-[#4FB3F6] mx-auto" />
              <h2 className="text-2xl font-bold text-[#0A2540]">Quanto tempo você tem por treino?</h2>
              <p className="text-gray-600">Inclua aquecimento e resfriamento</p>
            </div>

            <div className="space-y-3">
              {[
                { value: '20-30min', label: '20-30 minutos', desc: 'Treinos curtos e intensos' },
                { value: '30-45min', label: '30-45 minutos', desc: 'Duração moderada' },
                { value: '45-60min', label: '45-60 minutos', desc: 'Treinos completos' },
                { value: '60+min', label: 'Mais de 60 minutos', desc: 'Sessões longas' },
              ].map((time) => (
                <button
                  key={time.value}
                  onClick={() => updateData('tempoDisponivel', time.value)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    data.tempoDisponivel === time.value
                      ? 'border-[#4FB3F6] bg-[#4FB3F6]/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-[#0A2540]">{time.label}</div>
                  <div className="text-sm text-gray-600">{time.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 8: Confirmação */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Check className="w-12 h-12 text-[#4CE39E] mx-auto" />
              <h2 className="text-2xl font-bold text-[#0A2540]">Tudo pronto!</h2>
              <p className="text-gray-600">Revise suas respostas e confirme</p>
            </div>

            <div className="space-y-4 p-6 bg-gray-50 rounded-2xl">
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div><strong>Nome:</strong> {data.nome}</div>
                <div><strong>Objetivo:</strong> {
                  data.objetivoPrincipal === 'prova' ? 'Praticar para prova' :
                  data.objetivoPrincipal === 'condicionamento' ? 'Melhorar condicionamento' :
                  data.objetivoPrincipal === 'correr_sem_parar' ? 'Correr sem parar' :
                  data.objetivoPrincipal === 'aumentar_distancia' ? 'Aumentar distância' :
                  data.objetivoPrincipal === 'consistencia' ? 'Criar consistência' : ''
                }</div>
                {data.objetivoPrincipal === 'prova' && <div><strong>Data da prova:</strong> {data.dataProva}</div>}
                {data.objetivoPrincipal === 'aumentar_distancia' && <div><strong>Distância-alvo:</strong> {data.distanciaAlvo}</div>}
                <div><strong>Nível:</strong> {
                  data.nivelAtividade === 'sedentario' ? 'Sedentário' :
                  data.nivelAtividade === 'leve' ? 'Iniciante' :
                  data.nivelAtividade === 'moderado' ? 'Intermediário leve' :
                  data.nivelAtividade === 'ativo' ? 'Ativo' : ''
                }</div>
                <div><strong>Dias disponíveis:</strong> {data.diasDisponiveis.length}</div>
                <div><strong>Tempo por treino:</strong> {data.tempoDisponivel}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Voltar
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className="px-6 py-3 rounded-xl bg-[#0A2540] text-white hover:bg-[#0A2540]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="px-6 py-3 rounded-xl bg-[#4CE39E] text-white hover:bg-[#4CE39E]/90 transition-all"
            >
              Criar meu plano
            </button>
          )}
        </div>
      </div>
    </div>
  )
}