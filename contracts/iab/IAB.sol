pragma solidity ^0.7.1;

contract IAB
{
    enum Type
    {
        UnsafeDigitalEnvironment,
        Categories,
        ContentTaxonomy
    }

    enum UnsafeDigitalEnvironment
    {
        Safe,
        MilitaryConflict,
        Obscenity,
        Drugs,
        Tobacco,
        Adult,
        Arms,
        Crime,
        DeathAndInjury,
        OnlinePiracy,
        HateSpeech,
        Terrorism,
        SpamAndHarmfulSites,
        FakeNews
    }

    enum CategoryTop
    {
        Zero,
        ArtsAndEntertainment,
        Automotive,
        Business,
        Careers,
        Education,
        FamilyAndParenting,
        HealthAndFitness,
        FoodAndDrink,
        HobbiesAndInterests,
        HomeAndGarden,
        LawAndGovernmentAndPolitics,
        News,
        PersonalFinance,
        Society,
        Science,
        Pets,
        Sports,
        StyleAndFashion,
        TechnologyAndComputing,
        Travel,
        RealEstate,
        Shopping,
        ReligionAndSpirituality,
        Uncategorized,
        NonStandardContent,
        IllegalContent
    }

    enum ContentTaxonomyTier1
    {
        Automotive,
        BooksAndLiterature,
        BusinessAndFinance,
        Careers,
        Education,
        EventsAndAttraction,
        FamilyAndRelationships,
        FineArt,
        FoodAndDrink,
        HealthyLiving,
        HobbiesAndInterests,
        HomeAndGarden,
        MedicalHealth,
        Movies,
        MusicAndAudio,
        NewsAndPolitics,
        PersonalFinance,
        Pets,
        PopCulture,
        RealEstate,
        ReligionAndSpirituality,
        Science,
        Shopping,
        Sports,
        StyleAndFashion,
        TechnologyAndComputing,
        Television,
        Travel,
        VideoGaming
    }

    enum ContentChannel
    {
        Unknown
    }

    enum ContentType
    {
        Unknown
    }

    enum ContentMediaFormat
    {
        Unknown
    }

    enum ContentLanguage
    {
        Unknown
    }

    enum ContentSource
    {
        Unknown
    }

    enum ContentSourceGeo
    {
        Unknown
    }
}