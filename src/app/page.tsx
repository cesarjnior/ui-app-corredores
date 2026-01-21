  // Plan Selection
  if (currentScreen === 'plan-selection') {
    // Determinar nível baseado na anamnese
    let level = 'beginner'
    if (anamneseData) {
      if (anamneseData.jaCorreuAntes === 'sim' && anamneseData.nivelAtividade === 'ativo') {
        level = 'advanced'
      } else if (anamneseData.jaCorreuAntes === 'sim' || anamneseData.nivelAtividade === 'moderado') {
        level = 'intermediate'
      }
    }

    const daysPerWeek = anamneseData?.diasDisponiveis.length || 3

    // Gerar plano personalizado baseado no anamnese
    let customPlan = null
    if (anamneseData) {
      try {
        customPlan = generateCustomPlan(anamneseData)
      } catch (error) {
        console.error('Erro ao gerar plano:', error)
        // Fallback para planos pré-definidos
      }
    }

    const availablePlans = customPlan ? [customPlan] : TRAINING_PLANS.filter(plan => 
      plan.level === level && 
      plan.daysPerWeek <= daysPerWeek
    )

    return (
      <div className="min-h-screen bg-gray-50 p-8 pt-20">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#0A2540]">Seu plano personalizado</h1>
            <p className="text-gray-600">Plano criado especialmente para você</p>
          </div>

          {anamneseData && (
            <div className="bg-gradient-to-r from-[#4FB3F6]/10 to-[#4CE39E]/10 p-4 rounded-xl border-l-4 border-[#4FB3F6]">
              <p className="text-sm font-medium text-[#0A2540]">
                Baseado na sua anamnese: {anamneseData.diasDisponiveis.length} dias/semana • Meta: {anamneseData.objetivoPrincipal === 'prova' ? 'Prova' : anamneseData.objetivoPrincipal === 'aumentar_distancia' ? anamneseData.distanciaAlvo : 'Desenvolvimento geral'}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {availablePlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-[#4FB3F6] transition-all cursor-pointer"
                onClick={() => {
                  setSelectedPlan(plan)
                  setCurrentScreen('home')
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-[#0A2540] mb-1">{plan.name}</h3>
                    <p className="text-sm text-[#4FB3F6] font-medium">Por {plan.trainer}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#0A2540]">{plan.durationWeeks}</div>
                    <div className="text-xs text-gray-600">semanas</div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{plan.daysPerWeek}x por semana</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Target className="w-4 h-4" />
                    <span>Meta: {plan.goal}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setCurrentScreen('training-library')}
            className="w-full py-4 rounded-2xl border-2 border-[#4FB3F6] text-[#4FB3F6] font-semibold hover:bg-[#4FB3F6]/10 transition-all"
          >
            Ver biblioteca completa de treinos
          </button>
        </div>
      </div>
    )
  }