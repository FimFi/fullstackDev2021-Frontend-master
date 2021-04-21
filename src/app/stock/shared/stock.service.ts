import { Injectable } from '@angular/core';
import {SocketStock} from '../../app.module';
import {StockDto} from './stock.dto';
import {Observable} from 'rxjs';
import {StockModel} from './stock.model';
import {JoinStockDto} from './join-stock.dto';


@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private socketStocks: SocketStock) { }
  sendStock(stock: StockDto): void {
    this.socketStocks.emit('stock', stock)
  }

  updateStock(id: string, stock: StockModel): void {
    this.socketStocks.emit('updateStock', stock)
  }

  listenForCreateSuccess(): Observable<StockDto> {
    return this.socketStocks.fromEvent<StockDto>('stock-created-success')
  }
  listenForCreateError(): Observable<string> {
    return this.socketStocks.fromEvent<string>('stock-created-error')
  }
  listenForStocks(): Observable<StockModel[]>{
    return this.socketStocks.fromEvent<StockModel[]>("stocks")
  }

  listenForStockList(): void{
    this.socketStocks.emit('welcomeStock')
  }
  joinStock(dto: JoinStockDto): void {
    this.socketStocks.emit('joinStock', dto);
  }
}
