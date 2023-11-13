import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  cardData!: any[];
  startIndex = 0; // Initialize index for start of displayed cards
  cardsPerPage = 9; // Define number of cards per page

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getData().subscribe((data: any) => {
      this.cardData = data;
    });
  }
  getCurrentPageCards() {
    return this.cardData.slice(this.startIndex, this.startIndex + 9);
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
