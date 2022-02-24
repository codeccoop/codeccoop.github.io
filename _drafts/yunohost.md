---
title: Hello, Yunohost!
layout: post
author: lucas
categories: self-hosting
---

Amb aquest article volem donar el tret de sortida a una serie d'articles que
anirem publicant al voltant de la idea de _self-hosting_, o auto-allotjament.
Com a fil conductor utilitzarem el projecte [**Yunohost**](https://yunohost.org),
un sistema operatiu Linux dissenyat per a poder tenir, en qüestió de minuts, i sense
gairebé coneixement tècnic, un servidor web en marxa.

## Taula de continguts

1. [Introducció](#introducció)
2. [Yunohost](#yunohost)
3. [Què necessitaràs?](#què-necessitaràs)
4. [Següents passos](#següents-passos)

## Introducció

I us estareu preguntant: que vol dir _self-hosting_ i perquè aquesta gent m'està
explicant tot això?

Parafrasejant a la gent de **Yunohost**, self-hosting és _"l'activitat de
poseïr i administrar el teu propi servidor, sovint a casa, per tal d'allotjar
les teves dades personals i els teus serveis en comptes de relegar-ho
exclusivament a tercers"._

**I això perquè pot ser interessant més enllà dels entorns de frikis de la informàtica?**

Doncs bé, la idea és utilitzar aquest concepte per presentar altres formes
d'entendre internet i les xarxes, per desmontar mites al voltant de que és un servidor,
per explorar alternatives a les eines i serveis privatius de les grans empreses
tecnlògiques, per fer pedagogía sobre que vol dir el _cloud_, per recordar el consum
energètic i els costos materials de l'espai virtual, per parlar de
reciclatge tecnològic i obsolescències imposades, per reflexionar sobre les
implicacions polítiques i socials de les decisions que prenem a nivell
tecnològic i, qui sap, potser perquè acabis donant vida a aquell vell ordinador
que tens abandonat per casa i hi posis un servei de _streaming_ on mirar pel·licules
sense haver de pagar Netflix.

## Yunohost

Hola lector@. Si has arribat fins aquí fa pinta que hem aconseguit despertar el
teu interès. Me'n alegro. Així doncs, seguim, i ara ens toca presentar-te el que
serà el nostre company de viatge.

{:.centered}
[![yunohost-logo]({% link /assets/images/yunohost-logo.png %})](https://yunohost.org/)

> YunoHost és un sistema operatiu pensat per fer simplificar al màxim la feina
> d'administració d'un servidor, a més de democratitzar el món del "self-hosting",
> tot assegurant-ne la confiança, la seguretat, l'ètica i la lleugeresa.

{:.align-right}
_yunohost.org_

En resum: Yunohost és un sistema operatiu, però també un projecte de transformació
de la web.

Pel que fa al sistema operatiu, Yunohost és un *respin* del sistema operatiu
[Debian](https://www.debian.org/), basat en Linux, o, dit d'una altra manera,
una versió personalitzada del sistema operatiu Debian amb un instal·lador i un
seguit d'eines preinstal·lades i preconfigurades per funcionar com a servidor web.

I perquè volem presentar-vos aquest projecte? Doncs perquè compartim amb la seva
gent la voluntat de desfer la mística al voltant de la informàtica i de voler
refer els ponts entre la tecnologia i la gent comú més enllà dels rols de consumidors
passius en que ens encasella la filosofia del disseny centrat en l'usuari després
de ser apropiat per les empreses capitalistes.

**Avís per navegants. Yunohost ens facilitarà moltíssim la feina, però tot i així,
Google sempre t'ho possarà més fàcil, tot i que res és gràtis.**

La pregunta és: Quin és el preu que estàs disposat a pagar pels serveis que utilitzes
a diari a internet? Quant creus que valen les dades que generes amb l'ús dels teus
dispositius digitals? I les de mil·lions de persones a l'hora?

Si encara no t'ha quedat clar que és això del que estem parlant:

{:.centered.no-bottom}
[Yunohost Demo](https://demo.yunohost.org/yunohost/sso/?r=aHR0cHM6Ly9kZW1vLnl1bm9ob3N0Lm9yZy8=){:.button.is-link}

{:.centered}
user: demo<br/>
password: demo

## Què necessitaràs?

Donat que un dels valors que volem transmetre és el de l'estalvi pel que fa a consum
energètic i constos materials de les diferents solucions tecnològiques a adopat
al nostre dia a dia, et proposem tres opcions:

- Si tens una Raspberry PI, o altres sistemes monoplaca similars, aquesta serà
la millor opció. El consum energètic d'aquests ordinadors és una fracció
molt petita del que consumeix un ordinador normal.

- Remou el fons del teu armari, espolsa'l i treu d'allà aquell vell ordinador de
quan encara cursaves la ESO i que utilitzaves per xatejar amb els teus amics de
facebook quan facebook encara molava. Segueix amb nosaltres i aconseguirem que torni
a la vida!

- Demana a la teva xarxa si algú té algun ordinador antic que no utilitzi. En vista
de l'acceleradissim ritme de consum al que ens han dut la conjunció d'un
moment de revolució tencològica i una gestió del mateix des d'empreses capitalistes
necessitades d'una expansió constant dels seus mercats, no hauria de ser complicat.

**Sobre tot, sobre tot, no compris res si ho has de fer per seguir aquest
contingut, o tot el que estem fent perdrà sentit. No ens ho facis, siusplau.**

A més, necessitaràs un _pendrive_ o un CD verge (Whaat? Encara existeixen
els CDs?) on poder grabar la imàtge del sistema operatiu Yunohost que instal·larem
després. Aquest hauria de disposar d'una capacitat d'enmagatzematge mínim de 1GB.

{:.centered}
![cdrom]({% link /assets/images/cdrom.png %}){:style="height:200px;"}

{:.centered}
<sup>Per als més joves, això és una pila de CDs.</sup>

Per últim, necessitaràs un router amb accés a internet i la possibilitat d'obrir-hi
els ports de forma que puguis exposar el teu servidor a internet fent que el router
deixi passar les peticions que li arribin des d'internet cap a la teva LAN
(Local Area Network) on hi tindràs el teu servidor.

Aquest últim és un pas peliagut perquè no dependràs només de tu i t'hauràs d'entendre
amb el teu proveidor d'internet. Dedicarem un capitol sencer a parlar sobre aquest
tema per intentar resoldre tots els dubtes i escenaris possibles. En qualsevol cas,
si et topes am  un proveidor d'internet poc col·laborador, potser tens les de perdre,
però contaràs amb nosaltres quan vulguis fer-li un escrache.

## Següents passos

Denle like y suscribanse!
