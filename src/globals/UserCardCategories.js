import SchemaTypes from './SchemaTypes';

const baseballIcon = require('assets/icons/card-type/baseball.png');
const basketballIcon = require('assets/icons/card-type/basketball.png');
const footballIcon = require('assets/icons/card-type/football.png');
const hockeyIcon = require('assets/icons/card-type/hockey.png');
const soccerIcon = require('assets/icons/card-type/soccer.png');
const wrestlingIcon = require('assets/icons/card-type/wrestling.png');
const pokemonIcon = require('assets/icons/card-type/pokemon.png');
const magicIcon = require('assets/icons/card-type/magic.png');
const yugiohIcon = require('assets/icons/card-type/yugioh.png');
const multisportIcon = require('assets/icons/card-type/multisport.png');

export default [
  {
    label: 'Baseball',
    value: 1,
    sport: SchemaTypes.sport.BASEBALL,
    icon: baseballIcon,
  },
  {
    label: 'Basketball',
    value: 2,
    sport: SchemaTypes.sport.BASKETBALL,
    icon: basketballIcon,
  },
  {
    label: 'Football',
    value: 3,
    sport: SchemaTypes.sport.FOOTBALL,
    icon: footballIcon,
  },
  {
    label: 'Hockey',
    value: 4,
    sport: SchemaTypes.sport.HOCKEY,
    icon: hockeyIcon,
  },
  {
    label: 'Soccer',
    value: 5,
    sport: SchemaTypes.sport.SOCCER,
    icon: soccerIcon,
  },
  {
    label: 'Wrestling',
    value: 6,
    sport: SchemaTypes.sport.WRESTLING,
    icon: wrestlingIcon,
  },
  {
    label: 'Multi-Sport',
    value: 10,
    sport: SchemaTypes.sport.MULTISPORT,
    icon: multisportIcon,
  },
  {
    label: 'Pokémon',
    value: 7,
    game: SchemaTypes.game.POKEMON,
    icon: pokemonIcon,
  },
  {
    label: 'Magic: The Gathering',
    shortLabel: 'Magic',
    value: 8,
    game: SchemaTypes.game.MAGIC_THE_GATHERING,
    icon: magicIcon,
  },
  {
    label: 'Yu-Gi-Oh!',
    value: 9,
    game: SchemaTypes.game.YUGIOH,
    icon: yugiohIcon,
  },
];
