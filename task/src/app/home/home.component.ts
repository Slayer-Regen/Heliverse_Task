import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  cardData!: any[];
  startIndex = 0;
  cardsPerPage = 20; 
  filteredCards: any[] = [];
  uniqueDomains: string[] = [];


  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getData().subscribe((data: any) => {
      this.cardData = data;
      this.filteredCards = this.cardData;
      this.findUniqueDomains();
    });
  }

  findUniqueDomains() {
    this.uniqueDomains = [...new Set(this.cardData.map((card: any) => card.domain))];
  }

  getCurrentPageCards() {
    return this.filteredCards.slice(this.startIndex, this.startIndex + this.cardsPerPage);
  }

  searchByName(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      const searchValue = inputElement.value.toLowerCase();
      this.filteredCards = this.cardData.filter(
        (card: any) =>
          card.first_name.toLowerCase().includes(searchValue) ||
          card.last_name.toLowerCase().includes(searchValue)
      );
      this.startIndex = 0;
    }
  }

  filterByDomain(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement) {
      const domain = selectElement.value;
      this.filteredCards = this.cardData.filter((card: any) => (domain ? card.domain === domain : true));
      this.startIndex = 0;
    }
  }

  filterByGender(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement) {
      const gender = selectElement.value;
      this.filteredCards = this.cardData.filter((card: any) => (gender ? card.gender === gender : true));
      this.startIndex = 0;
    }
  }

  filterByAvailability(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement) {
      const availability = selectElement.value;
      const available = availability === 'true' ? true : availability === 'false' ? false : null;
      this.filteredCards = this.cardData.filter((card: any) =>
        available !== null ? card.available === available : true
      );
      this.startIndex = 0;
    }
  }

  moveCards(direction: 'forward' | 'backward') {
    if (direction === 'forward') {
      if (this.startIndex + this.cardsPerPage < this.cardData.length) {
        this.startIndex += this.cardsPerPage;
      }
    } else if (direction === 'backward') {
      if (this.startIndex - this.cardsPerPage >= 0) {
        this.startIndex -= this.cardsPerPage;
      }
    }
  }
}