class Siec {
	constructor(liczba_wejsc, lnww, faktyw) {
    this.warstwy = [];
    this.epokiUczenia = 0;
    this.blad = 100;
    this.faktyw = faktyw;
    for(let i=0; i<lnww.length; i++)
      this.warstwy[i] = new Warstwa((i == 0 ? liczba_wejsc : lnww[i-1]), lnww[i])
  }

	oblicz_wyjscie(wejscia) {
    let wyjscie = [];
    for(let i=0; i<this.warstwy.length; i++)
      wejscia = wyjscie = this.warstwy[i].oblicz_wyjscie(wejscia, this.faktyw);
		return wyjscie;
  }

  liczDelte(delty) {
    for(let i=0; i<this.warstwy.length; i++) {
      if (i == 0)
        this.warstwy[this.warstwy.length-1].liczDelteWyjsciowa(delty);
      else {
        let delty = [];
        let wagi = [];
        for(let j=0; j<this.warstwy[this.warstwy.length-i].neurony.length; j++) {
          delty.push(this.warstwy[this.warstwy.length-i].neurony[j].delta);
          wagi.push(this.warstwy[this.warstwy.length-i].neurony[j].wagi);
        }
        this.warstwy[this.warstwy.length-i-1].liczDelte(delty, wagi);
      }
    }
  }

  liczNoweWagi(wspolUcz) {
    for(let i=0; i<this.warstwy.length; i++)
      this.warstwy[i].liczNoweWagi(wspolUcz, this.faktyw);
  }

  uczSiec(wspolUcz, cu, bladZadany, max) {
    while(this.blad > bladZadany && this.epokiUczenia < max)
      this.uczSiecEpoka(wspolUcz, cu);

    return `Długość ciągu uczącego: ${cu.length} \r\nEpok: ${this.epokiUczenia}, Błąd: ${Math.floor(10000*this.blad)/10000}`;
  }

  uczSiecEpoka(wspolUcz, cu) {
    this.blad = 0;
    const ciag = Object.assign([], cu);

    for(let i=0; i<ciag.length; i++) {
      const randomIndex = Math.floor(Math.random() * (ciag.length));
      const elementCu = ciag[randomIndex];
      ciag.splice(randomIndex, 1);
      const y = this.oblicz_wyjscie(elementCu.in);

      const delty = [];
      for(let j=0; j<elementCu.out.length; j++)
        delty.push(elementCu.out[j] - y[j]);

      this.liczDelte(delty);

      for(let j=0; j<this.warstwy[this.warstwy.length-1].neurony.length; j++)
        this.blad += this.warstwy[this.warstwy.length-1].neurony[j].delta * this.warstwy[this.warstwy.length-1].neurony[j].delta;
      this.liczNoweWagi(wspolUcz);
    }

    this.liczBlad(cu.length);
    this.epokiUczenia++;
  }

  liczBlad(length) {
    this.blad = Math.sqrt(this.blad / length)
    console.log(`${this.epokiUczenia}: ${this.blad}`);
  }

  testuj(ct) {
    let skutecznosc = 0; //resetuje skutecznosc
    let poprawne = 0; //resetuje ilosc poprawnych wynikow
    ct.forEach(element => { //iteruje po elementach ciagu testowego
      let wyjscia = this.oblicz_wyjscie(element.in); //liczy wyjscie dla elementu ciagu testowego
      wyjscia.forEach((wyjscie, index) => { //iteruje po wyjsciach sieci dla danego wyrazu ciagu testowego
        if (wyjscia.indexOf(Math.max(...wyjscia)) === index) //sprawdza ktore wyjscie ma najwieksza wartosc i przypisuje mu 1 a innym wyjsciom 0, przykladowo [0.88, 0.12, 0.01] => [1, 0, 0]
          wyjscia[index] = 1;
        else
          wyjscia[index] = 0;
      })

      if(wyjscia.indexOf(1) == element.out.indexOf(1)) //jesli wyjscia sa takie same dla ciagu testowego i dla wyjscia z sieci to skutecznosc zwieksza sie o 1
        poprawne = ++skutecznosc;
    });

    skutecznosc = 100 * skutecznosc / ct.length; //liczymy skutecznosc 100% * skutecznosc / dlugosc_ciagu_testowego = skutecznosc w %

    return `Długość ciągu testowego: ${ct.length} \r\nSkuteczność: ${Math.floor(100*skutecznosc)/100}% [${poprawne}/${ct.length}]`;
  }
}
