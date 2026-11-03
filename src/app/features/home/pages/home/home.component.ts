import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
}

interface Car {
  id: number;
  year: number;
  name: string;
  type: string;
  image: string;
  price: number;
  tags: string[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly sanitizer = inject(DomSanitizer);
  private timer?: ReturnType<typeof setInterval>;

  // ---------- HERO ----------
  readonly slides: HeroSlide[] = [
    {
      image: 'assets/hero/1.webp',
      title: 'Комерційні авто з Європи',
      subtitle: 'Перевірені фургони, рефрижератори та бортові',
    },
    {
      image: 'assets/hero/2.webp',
      title: 'Великий вибір автомобілів',
      subtitle: 'Mercedes-Benz, Volkswagen та MAN',
    },
    {
      image: 'assets/hero/3.webp',
      title: 'Рефрижератори та тенти',
      subtitle: 'Готові до роботи з першого дня',
    },
    {
      image: 'assets/hero/4.webp',
      title: 'Безкоштовна доставка',
      subtitle: 'Доставимо автомобіль по всій Україні',
    },
    {
      image: 'assets/hero/5.webp',
      title: 'Чесна історія пробігу',
      subtitle: 'Кожен автомобіль проходить діагностику',
    },
    {
      image: 'assets/hero/6.webp',
      title: 'Працюємо з 2000 року',
      subtitle: 'Понад 20 років досвіду на ринку',
    },
    {
      image: 'assets/hero/7.webp',
      title: 'Приїжджайте на стоянку',
      subtitle: 'Біля Рівного, траса Київ — Чоп',
    },
  ];
  readonly current = signal(1);

  // ---------- CARS ----------
  readonly cars: Car[] = [
    {
      id: 1,
      year: 2020,
      name: 'Mercedes-Benz Sprinter',
      type: 'Комерційний автомобіль',
      image: 'assets/cars/sprinter.jpg',
      price: 22900,
      tags: ['188 000 км', 'Бортовий', '2.2 л', 'Дизель', 'Автомат'],
    },
    {
      id: 2,
      year: 2020,
      name: 'Volkswagen Crafter',
      type: 'Комерційний автомобіль',
      image: 'assets/cars/crafter-1.jpg',
      price: 29900,
      tags: ['200 000 км', 'Рефрижератор', '2 л', 'Дизель', 'Механіка'],
    },
    {
      id: 3,
      year: 2020,
      name: 'Volkswagen Crafter',
      type: 'Комерційний автомобіль',
      image: 'assets/cars/crafter-2.jpg',
      price: 22900,
      tags: ['200 000 км', 'Фургон', '2 л', 'Дизель', 'Механіка'],
    },
    {
      id: 4,
      year: 2015,
      name: 'Volkswagen Crafter',
      type: 'Комерційний автомобіль',
      image: 'assets/cars/crafter-3.jpg',
      price: 24900,
      tags: ['200 000 км', 'Фургон', '2 л', 'Дизель', 'Механіка'],
    },
  ];

  // ---------- CONTACTS ----------
  readonly phones = [
    { label: 'Основний номер', value: '+380 67 100 21 24', href: 'tel:+380671002124' },
    { label: 'Додатковий номер', value: '+380 50 200 21 24', href: 'tel:+380502002124' },
  ];

  readonly schedule = [
    { day: 'Понеділок – п’ятниця', hours: '09:00 – 18:30', off: false },
    { day: 'Субота', hours: '09:00 – 14:00', off: false },
    { day: 'Неділя', hours: 'Вихідний', off: true },
  ];

  readonly mapUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.google.com/maps?q=вул.+Примісна+87в,+Біла+Криниця&output=embed',
  );
  readonly routeUrl =
    'https://www.google.com/maps/dir/?api=1&destination=вул.+Примісна+87в,+Біла+Криниця';
  readonly openMapUrl = 'https://www.google.com/maps/search/?api=1&query=вул.+Примісна+87в,+Біла+Криниця';

  // ---------- LIFECYCLE ----------
  ngOnInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  next(manual = false): void {
    this.current.update((i) => (i + 1) % this.slides.length);
    if (manual) this.restartAutoplay();
  }

  prev(): void {
    this.current.update((i) => (i - 1 + this.slides.length) % this.slides.length);
    this.restartAutoplay();
  }

  goTo(i: number): void {
    this.current.set(i);
    this.restartAutoplay();
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  scrollTrack(track: HTMLElement, dir: 1 | -1): void {
    track.scrollBy({ left: dir * (track.clientWidth * 0.8), behavior: 'smooth' });
  }

  private startAutoplay(): void {
    this.timer = setInterval(() => this.next(), 6000);
  }

  private stopAutoplay(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private restartAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
  }
}
