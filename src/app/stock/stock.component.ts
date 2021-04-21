import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {StockService} from './shared/stock.service';
import {StockModel} from './shared/stock.model';
import {Observable, Subject} from 'rxjs';
import {ChatClient} from '../chat/shared/chat-client.model';
import {StockState} from './state/stock.state';
import {Select, Store} from '@ngxs/store';
import {ListenForStocks} from './state/stock.actions';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  @Select(StockState.stocks) stockClients$: Observable<StockModel[]> | undefined;
  stockFC = this.fb.group({
    stockName: [''],
    initValue: [''],
    currValue: [''],
    description: ['']
  });
  valueFc = this.fb.group({
    newValue: ['']
  });
  stocks$: Observable<StockModel[]> | undefined;
  unsubscribe$ = new Subject();
  stockCreate: StockModel | undefined;
  error: string | undefined;
  selectedStock: StockModel | undefined;


  constructor(private stockService: StockService, private fb: FormBuilder, private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new ListenForStocks());
    this.stocks$ = this.stockService.listenForStocks();
    this.stockService.listenForStocks();
    this.stockService.listenForStockList();
  }
  sendMessage(): void{
    console.log(this.stockFC.value);
  }
  ngOnDestroy(): void{
    console.log('Destroyed');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateStock(): void {
    if(this.selectedStock){
      this.stockService.updateStock(this.selectedStock.id,{
        id: this.selectedStock.id,
        currValue: this.valueFc.value.newValue,
        description: this.selectedStock.description,
        initValue: this.selectedStock.initValue,
        stockName: this.selectedStock.stockName
      })
    }
  }

  sendStock(): void {
    if (this.stockFC.value) {
      console.log(this.stockFC.value)
      this.stockService.sendStock(this.stockFC.value);
    }
  }



  onSelect(stock: StockModel): void {
    this.selectedStock = stock;
  }
}
