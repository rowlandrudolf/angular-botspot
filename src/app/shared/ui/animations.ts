import { animate, query, style, transition, trigger } from "@angular/animations";

export const postAddState = trigger('postAddTrigger', [
    transition(':enter', [
        style({
            opacity: 0,
            transform: 'translateY(-20%)'
        }),
        animate('800ms ease-out', style({
            opacity: 1,
            transform: 'translateY(0)'
        }))
    ]),
    transition(':leave', [
        animate('400ms ease-in', style({
            opacity: 0,
            transform: 'translateY(20%)'
        }))
    ])
])


export const showCommentFormState = trigger('showCommentFormTrigger', [
    transition(':enter', [
        style({
            transform: 'translateY(-100%)'
        }),
        animate('400ms ease-out', style({
            transform: 'translateY(0%)'
        }) )
    ]),
    transition(':leave', [
        style({
            transform: 'translateY(0%)'
        }),
        animate('400ms ease-out', style({
            transform: 'translateY(-100%)'
        }) )
    ])
])

export const fadeAnimation = trigger('fadeAnimation', [
    transition('* => *', [
      query(
        ':enter',
        [
          style({ opacity: 0 }),
          animate('0.3s', style({ opacity: 1 })),
        ],
        { optional: true }
      ),
    ]),
  ]);
