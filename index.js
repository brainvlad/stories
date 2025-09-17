initPlayer({
  target: '.my-player',
  slides: [
    {
      url: './img/stories-test.png',
      alt: 'story 1',
      filter: ['contrast(150%)'],
      overlays: [
        {
          type: 'text',
          value: 'hello мой ебейший сябар',
          classes: ['bg-black', 'border-round-full'],
          styles: {
            color: 'orange',
            'font-size': '36px',
            'text-shadow': '1px 1px #FF0000',
            top: '20%',
            left: '20%',
            transform: 'rotate(10deg)',
          }
        },
        {
          type: 'text',
          value: 'and<br />листай<br/>дальше',
          styles: {
            color: 'red',
            'font-size': '30px',
            'text-shadow': '1px 1px #FF0000',
            bottom: '20%',
            left: '20%',
            transform: 'rotate(-30deg)',
            animation: 'scale 6s infinite ease-in-out',
          }
        },
        // {
        //   type: 'question',
        //   question: 'Норм чи не?',
        //   variants: [
        //     'Норм',
        //     'Не'
        //   ],
        //   styles: {
        //     bottom: '45%',
        //     left: '30%',
        //   }
        // },
      ]
    },
    {url: './img/stories-test-2.png', alt: 'story 2'},
    {url: './img/stories-test-3.png', alt: 'story 3'},
    {url: './img/stories-test-4.png', alt: 'story 4'},
  ],
  delayPerSlide: 4,
})