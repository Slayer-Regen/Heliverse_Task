// import { Component, OnInit } from '@angular/core';
// import { DataService } from '../data.service';

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css']
// })
// export class HomeComponent implements OnInit {
//   cardData!: any[];
//   startIndex = 0; // Initialize index for start of displayed cards
//   cardsPerPage = 9; // Define number of cards per page

//   constructor(private dataService: DataService) {}

//   ngOnInit() {
//     this.dataService.getData().subscribe((data: any) => {
//       this.cardData = data;
//     });
//   }
//   getCurrentPageCards() {
//     return this.cardData.slice(this.startIndex, this.startIndex + 9);
//   }
//   moveCards(direction: 'forward' | 'backward') {
//     if (direction === 'forward') {
//       if (this.startIndex + this.cardsPerPage < this.cardData.length) {
//         this.startIndex += this.cardsPerPage;
//       }
//     } else if (direction === 'backward') {
//       if (this.startIndex - this.cardsPerPage >= 0) {
//         this.startIndex -= this.cardsPerPage;
//       }
//     }
//   }
// }
import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

interface Card {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  avatar: string;
  domain: string;
  available: boolean;
  selected?: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  cardData: Card[] = [];
  filteredCards: Card[] = [];
  team: Card[] = [];
  startIndex = 0; // Initialize index for start of displayed cards
  cardsPerPage = 9; // Define number of cards per page
  uniqueDomains: string[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getData().subscribe((data: any) => {
      this.cardData = data;
      this.filteredCards = this.cardData.slice(this.startIndex, this.startIndex + this.cardsPerPage);
      this.findUniqueDomains();
    });
  }

  findUniqueDomains() {
    this.uniqueDomains = [...new Set(this.cardData.map((card: Card) => card.domain))];
  }

  moveCards(direction: 'forward' | 'backward') {
    if (direction === 'forward') {
      if (this.startIndex + this.cardsPerPage < this.filteredCards.length) {
        this.startIndex += this.cardsPerPage;
      }
    } else if (direction === 'backward') {
      if (this.startIndex - this.cardsPerPage >= 0) {
        this.startIndex -= this.cardsPerPage;
      }
    }
  }

  searchByName(event: Event) {
    const inputElement = event.target as HTMLInputElement; // Ensure the target is an input element
    if (inputElement) {
      const searchValue = inputElement.value.toLowerCase();
      this.filteredCards = this.cardData.filter(
        (card: Card) =>
          card.first_name.toLowerCase().includes(searchValue) ||
          card.last_name.toLowerCase().includes(searchValue)
      );
    }
  }
  
  filterByDomain(event: Event) {
    const selectElement = event.target as HTMLSelectElement; // Ensure the target is a select element
    if (selectElement) {
      const domain = selectElement.value;
      this.filteredCards = this.cardData.filter((card: Card) => (domain ? card.domain === domain : true));
    }
  }

 filterByGender(event: Event) {
  const selectElement = event.target as HTMLSelectElement;
  if (selectElement) {
    const gender = selectElement.value;
    this.filteredCards = this.cardData.filter((card: Card) => (gender ? card.gender === gender : true));
  }
}

filterByAvailability(event: Event) {
  const selectElement = event.target as HTMLSelectElement;
  if (selectElement) {
    const availability = selectElement.value;
    const available = availability === 'true' ? true : availability === 'false' ? false : null;
    this.filteredCards = this.cardData.filter((card: Card) =>
      available !== null ? card.available === available : true
    );
  }
}

  addToTeam(card: Card) {
    if (card.available && !this.team.find((member: Card) => member.id === card.id)) {
      card.selected = !card.selected;
      if (card.selected) {
        this.team.push(card);
      } else {
        this.team = this.team.filter((member: Card) => member.id !== card.id);
      }
    }
  }
}
