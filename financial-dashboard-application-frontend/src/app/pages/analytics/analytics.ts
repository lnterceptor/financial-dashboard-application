import { Component, inject } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MatCardModule, MatCard } from '@angular/material/card';
import { DataPoint, TransactionService } from '../../services/transaction-service';
import { Observable, map, combineLatest } from 'rxjs';
import {AsyncPipe} from '@angular/common'
import { AuthService } from '../../services/auth-service';
import { User } from '../../interfaces/user';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-analytics',
  imports: [BaseChartDirective, MatCard, AsyncPipe, CurrencyPipe],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css'
})
export class Analytics {

  incomeChart = {
    type: 'line',
    data:{
      datasets: [{
         data: [{x: '2016-12', y: 20}], label: 'Expenses'
      },
        {data: [{x: '2016-12', y: 20}], label: 'Income'}
    ]
    
    },
    options: {
      
      responsive: true,
      plugins:
    {
      title:{
      display: true,
      text: 'Income and Expenses over time'
    }
  }
    }
  }

  netIncomeChart = {
    type: 'line',
    data:{
      
      datasets: [{
         data: [{x: '2016-12', y: 20}], label: 'Net income'}
    ]
    },
    options: {
      responsive: true,
      plugins:
    {
      title:{
      display: true,
      text: 'Net income over time'
    }
  }
    }
  }

  pieChartData = {
    type: 'pie',
    
    data: {
    labels: ['Pie'],
    datasets: [{
      data: [100]
    }]
  },
  options: {
    responsive: true,
    plugins:
    {
      title:{
      display: true,
      text: 'Breakdown of Expenses'
    }
  }
  }
  };


  transactionService = inject(TransactionService);
  private getExpenses !: Observable<DataPoint[]>;
  private getIncome !: Observable<DataPoint[]>;
  income!: Observable<number>;
  expenses!: Observable<number>;
  netIncome!:Observable<number>;
  user : User | null = null;
  authService = inject(AuthService);

  constructor(){
    this.authService.currentUser.subscribe(
      user => this.user = user
    )
  }

  ngOnInit(){
    this.getExpenses = this.transactionService.getExpensesForCharts();
    this.getIncome = this.transactionService.getIncomeForCharts();
    this.setCharts();
    
      this.income = this.transactionService.getIncome();
      this.expenses = this.transactionService.getExpenses();
      this.netIncome = combineLatest([this.income, this.expenses]).pipe(
        map(([income, expenses]) => income - expenses)
      )
  }
  
  setCharts(){
    
    this.setPieChart();
    this.setIncomeExpensesChart();
    this.setNetIncomeChart();
    
  }
  setPieChart(){
    this.netIncomeChart.data.datasets[0].data.pop();
    this.pieChartData.data.labels.pop();
    this.transactionService.getExpensesToPieChart().subscribe(
      value => {
        for(let i = 0; i < value.length; i++){
        this.pieChartData.data.labels.push(value[i].x)
        this.pieChartData.data.datasets[0].data.push(value[i].y);
        }
      }

    );

  }

  setNetIncomeChart(){
    let dataPoints: DataPoint[] = [];
    this.netIncomeChart.data.datasets[0].data.pop();
    let currentExpenses = 0;

    this.getIncome.subscribe(transactions => {
        dataPoints = transactions;
    });
    this.getExpenses.subscribe(transactions => {
      for(let i = 0; i < transactions.length; i++){
        
        currentExpenses += dataPoints[i].y - transactions[i].y;  
        dataPoints[i].y = currentExpenses;  
      }
    });
    this.netIncomeChart.data.datasets[0].data = dataPoints;
  }

  setIncomeExpensesChart(){
    
      this.getExpenses.subscribe(transactions => {
        this.incomeChart.data.datasets[0].data.pop();
        for(let i = 0; i < transactions.length; i++){
          this.incomeChart.data.datasets[0].data.push({x:transactions[i].x, y:transactions[i].y});
        }
      });

      this.getIncome.subscribe(transactions => {
        this.incomeChart.data.datasets[1].data.pop();
        for(let i = 0; i < transactions.length; i++){
          this.incomeChart.data.datasets[1].data.push({x:transactions[i].x, y:transactions[i].y});
        }
      });
  }  
}
