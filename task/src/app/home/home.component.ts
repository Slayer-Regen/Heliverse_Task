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
  selectedTeam: any[] = [];
  teams: any[] = [];



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
  createTeam() {
    const selectedDomain = this.filteredCards.filter((card: any) => card.available && !this.selectedTeam.includes(card));
    this.selectedTeam = [...this.selectedTeam, ...selectedDomain];
  }

  showTeamDetails() {
    console.log('Team Members:', this.selectedTeam);
  }
 
  addToTeam(card: any) {
    if (card.available) {
      if (!this.selectedTeam.includes(card)) {
        const memberInTeam = this.teams.some(team => team.includes(card));
        if (!memberInTeam) {
          this.selectedTeam.push(card);
        } else {
          alert(`${card.first_name} ${card.last_name} is already in a team.`);
        }
      }
    } else {
      alert(`${card.first_name} ${card.last_name} is not available.`);
    }
  }
  
  

  isMemberAlreadyAdded(card: any): boolean {
    return this.selectedTeam.includes(card);
  }
  formTeam() {
    this.teams.push(this.selectedTeam);

    this.cardData = this.cardData.filter(card => !this.selectedTeam.includes(card));

    this.selectedTeam = [];
  }
}