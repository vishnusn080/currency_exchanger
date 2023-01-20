import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../store/store.service';
import { ActivatedRoute } from '@angular/router';
import { TYPE } from 'src/app/constants/constants';

@Component({
  selector: 'app-detailspage',
  templateUrl: './detailspage.component.html',
  styleUrls: ['./detailspage.component.scss'],
})
export class DetailspageComponent implements OnInit {
  constructor(private store: StoreService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.store.dispatch(TYPE.PAGE_NAME, 'details');
  }
}
