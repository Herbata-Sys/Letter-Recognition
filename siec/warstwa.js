class Warstwa {
	constructor(liczba_wejsc, liczba_neuronow) {
    this.neurony = [];
		for(let i=0; i<liczba_neuronow; i++)
			this.neurony[i] = new Neuron(liczba_wejsc);
  }

	oblicz_wyjscie(wejscia, faktyw) {
    let wyjscia = [];
    for(let i=0; i<this.neurony.length; i++)
      wyjscia.push(this.neurony[i].oblicz_wyjscie(wejscia, faktyw));
		return wyjscia;
  }

  liczDelte(delty, wagi) {
    for(let i=0; i<this.neurony.length; i++) {
      const wagiDoNeuronu = [];

      for(let j=0; j<wagi.length; j++)
        wagiDoNeuronu.push(wagi[j][i+1]);

      this.neurony[i].liczDelte(delty, wagiDoNeuronu);
    }
  }

  liczDelteWyjsciowa(delty) {
    for(let i=0; i<this.neurony.length; i++)
      this.neurony[i].liczDelteWyjsciowa(delty[i]);
  }

  liczNoweWagi(wspolUcz, faktyw) {
    for(let i=0; i<this.neurony.length; i++)
      this.neurony[i].liczNoweWagi(wspolUcz, faktyw);
  }
}
