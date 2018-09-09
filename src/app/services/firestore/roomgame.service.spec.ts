import { TestBed, inject } from '@angular/core/testing';

import { RoomgameService } from './roomgame.service';

describe('RoomgameService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoomgameService]
    });
  });

  it('should be created', inject([RoomgameService], (service: RoomgameService) => {
    expect(service).toBeTruthy();
  }));
});
