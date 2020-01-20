class Neuron {
	constructor(liczba_wejsc) {
    this.wagi = [];
    this.fi = 0;
    this.delta = 0;
    this.wejscia = [];
		this.generuj(liczba_wejsc);
  }

	generuj(liczba_wejsc) {
		for(let i=0; i<=liczba_wejsc; i++)
      this.wagi[i] = Math.random()*0.1;
  }

	oblicz_wyjscie(wejscia, faktyw) {
    this.fi = this.wagi[0];
    this.wejscia = wejscia;

		for(let i=1; i<this.wagi.length; i++)
      this.fi += this.wagi[i]*this.wejscia[i-1];

    if (faktyw == 'unipolarna')
      return 1/(1+Math.exp(-this.fi));
    else if (faktyw == 'bipolarna')
      return (1-Math.exp(-this.fi))/(1+Math.exp(-this.fi));
  }

  liczDelte(delty, wagi) {
    this.delta = 0;
    for(let i=0; i<wagi.length; i++)
      this.delta += wagi[i]*delty[i];
  }

  liczDelteWyjsciowa(delta) {
    this.delta = delta;
  }

  liczNoweWagi(wspolUcz, faktyw) {
    let pochodna = 0;
    if (faktyw == 'unipolarna')
      pochodna = (Math.exp(-this.fi) / ( ( Math.exp(-this.fi) + 1 ) * ( Math.exp(-this.fi) + 1 ) ) );
    else if (faktyw == 'bipolarna')
      pochodna = (2 * Math.exp(this.fi)) / ((1 + Math.exp(this.fi)) * (1 + Math.exp(this.fi)));

    this.wagi[0] += wspolUcz * this.delta * pochodna;

    for(let i=1; i<this.wagi.length; i++)
      this.wagi[i] += wspolUcz * this.delta * pochodna * this.wejscia[i-1];
    this.fi = 0;
  }
}
