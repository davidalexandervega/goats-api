const makeEvent = {
  seeded1() {
    return {
      id: 1, // not in seed
      creator_id: 1,
      venue_id: 1,
      image_url: 'https://1.bp.blogspot.com/-iF7sXspSmXk/W1oQAgNzJEI/AAAAAAAAAPA/FDnYOp28gwQcLqfHAlornSEpqEpKFwXwgCLcBGAs/s1600/Mortuous-Through_Wilderness-flyer%2528web%2529.jpg',
      event_times: 'Doors at 7pm',
      title: 'Mortuous, Fetid, Hyperdontia',
      description: 'Catch west coast tour before they leave. Extremely Rotten Productions.',
      start_date: '2019-12-30T00:00:00.000Z',
      end_date: '2019-12-30T00:00:00.000Z'
    }
  },

  postBodyMin() {
    return {
      creator_id: 1,
      image_url: 'https://thumbs.worthpoint.com/zoom/images1/1/0416/10/vintage-mercyful-fate-poster_1_f8b6fba67726fd6b35ee65aa8076e3eb.jpg',
      title: 'Merciful Fate RETURNS'
    }
  },

  postBodyNotMyId() {
    return {
      creator_id: 2,
      image_url: 'https://thumbs.worthpoint.com/zoom/images1/1/0416/10/vintage-mercyful-fate-poster_1_f8b6fba67726fd6b35ee65aa8076e3eb.jpg',
      title: 'Merciful Fate RETURNS'
    }
  },

  postBodyLongText() {
    return {
      creator_id: 1,
      image_url: 'https://thumbs.worthpoint.com/zoom/images1/1/0416/10/vintage-mercyful-fate-poster_1_f8b6fba67726fd6b35ee65aa8076e3eb.jpg',
      title: 'nuoXB8cRfJisdy5X5XlFiipz9K9en7q4PFYHbAevm1CPImsAs0s6de2MGIjFUssca67',
      description: 'inWdePqDNPrZ49lOnt2FLcu8LxBQoUrKoZEpy2JHjuxsMZx0RYj8CR1zx4eKeQtALWUs53khZLJf28AgOT19FP1d6dY4SjoqRAlvzNky50QdhqqscLkHSJq6boR9932E4UvOovG85D52pD4F8lHxspn1S9KZgicR3TG4ecy1AAdGkoGmLKHCqIqluHHXaeRe2maM39g4mtJ9ytSH8VIugVhGtiivzIT23uQTJJJLzSPahqj3UzoVmODAxQoKfy4k6g2AKgdr49e1JNOijkXSftJ71gc3jA7khdYhDps9LjtjndMs8tsVQJfh0tbNW8NtMhtOW4kQEnIyg7KUUNR4plvh1eiANMnWYk3PgM4xfHiJZX2RCKR5dP6gsiC2KdqyWenKN0ee3mrc0ZcA0IYFSypNhPBmOMsS1Wj6yDIqj9Qa0vH0oxqKOmlnQJFP1DCMPXofBKwDub1JO0tCKi3Xe4qgD2FrrkVv1UZlvsIyVuhcXusHBbxCadMOtLmpysYJC1xy2DDVytiBdE7dHQeoZzEg8xYFhd0CFmm7PpXxVj1saGPZfWMvcxU0a7hDe7bUe5dkeTRV69S4aN7Hiy1fmDcmg4JyPPdPSeQjfOWkoGa34udJPqqLkivBieQ5LWlIq4SzLLqAaTVytXNSqxDcgNMa667',
      event_times: 'nuoXB8cRfJisdy5X5XlFiipz9K9en7q4PFYHbAevm1CPImsAs0s6de2MGIjFUssca67'
    }
  }
}

module.exports = { makeEvent }
